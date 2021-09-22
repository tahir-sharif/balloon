// Basic Functions used..
function errMsg(msg , path){
    path.innerHTML = msg
    setTimeout(()=>{ path.innerHTML = '&nbsp;' } , 2500)
}



// Page Information
var inputForm = document.querySelector('.inputForm');
var mnPage = document.querySelector('.mnPage');

// signup Info.
var regUserName = document.querySelector('.userName');
var regEmail = document.querySelector('.email');
var regPassword = document.querySelector('.password');

// Login Info
var loginEmail = document.querySelector('.loginEmail');
var loginPassword = document.querySelector('.loginPassword');

// Form Buttons
var signupBtn = document.querySelector('.signupBtn');
var loginBtn = document.querySelector('.loginBtn');

// Loader to Hide on page load
var loader = document.querySelector('.loader');

// Show & Hide Login and signup forms
var loginForm = document.querySelector('.loginForm');
var signupForm = document.querySelector('.signupForm');

function showLoginForm() {
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
};

function showSignupForm() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
};


// Firebase Authentication
const firebaseConfig = {
    apiKey: "AIzaSyAFEIMiMQcE8cB_Ms7dJYA2F4U2Mw4ddGQ",
    authDomain: "tahir-ff29f.firebaseapp.com",
    projectId: "tahir-ff29f",
    storageBucket: "tahir-ff29f.appspot.com",
    messagingSenderId: "660400590737",
    appId: "1:660400590737:web:c32bef823b2541a39a5430",
    measurementId: "G-8KFK8LSCV0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
console.log(auth)

// Create New account
function signup() {
    const email = regEmail.value
    const password = regPassword.value
    const userName  = regUserName.value


    auth.createUserWithEmailAndPassword(email, password)
    .then(()=>{
        var userUid = firebase.auth().currentUser.uid;
        firestore.collection('userData').doc(userUid).set({
            userName
        })
    })
    .catch((error) => {
        alert(error)
    });
}
signupBtn.onclick = () => { signup() }

// Login Function
function login() {
    const email = loginEmail.value;
    const password = loginPassword.value;

    auth.signInWithEmailAndPassword(email, password).catch((error) => {
        alert(error);
    })
};
loginBtn.onclick = () => { login() }

// Logout Function
function logout() {
    auth.signOut();
}
var u;
auth.onAuthStateChanged((user) => {
    loader.style.display = 'none'
    console.log( user )
    if (user) {

        document.title = "Tahir's Messenger"

        inputForm.style.display = 'none'
        mnPage.style.display = 'flex'

        console.log('you are logged in', user.email , '!')
        // document.querySelector('.wlcm').innerHTML += ' ' + user.email
        u = user;
        
        firestore.collection('users').doc(user.uid).set({
            email: user.email,
            lastLoggedInAt: new Date()
        })
            .then(() => {
                console.log("Document written");
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

            setMessages()

    } else {

        document.title = 'Login or Signup'

        inputForm.style.display = 'flex'
        mnPage.style.display = 'none'

        console.log('no account is log in !')

    }
});

function setMessages(){
    const messageRef = firestore.collection('messages')
    messageRef.onSnapshot((snap)=>{
        var f = snap.docChanges()
        f = f.reverse();
        f.forEach((change)=>{
            if(change.type == 'added'){
                createMsgElement(change.doc.data())
            };
        })
    })
}


function sendMessage(){
    const userEmail = auth.currentUser.email;
    const message = msgTxt.value;

    firestore.collection('messages').add({
        userEmail , message , time : Date.now()
    }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

// Create Div For Message
var messageParent = document.querySelector(".messages")
var msgTxt = document.querySelector('.msgTxt');
var sndBtn = document.querySelector('.sndBtn');

function createMsgElement(data){
        const currentUser = auth.currentUser.email;

        var div = document.createElement('div');
        span = document.createElement('span')
        msgDiv = document.createElement('div');

        div.classList.add('msgBody')
        msgDiv.classList.add('msg')
        span.classList.add('msgName')
        msgDiv.innerHTML = data.message;
        
        msgDiv.appendChild(span)
        div.appendChild(msgDiv)
        messageParent.appendChild(div)

        if(data.userEmail == currentUser){
            div.classList.add('sender');
            span.innerHTML = ''
        }else{
            div.classList.add('receiver');
            span.innerHTML = data.userEmail
        }

        messageParent.scroll(0 , messageParent.offsetHeight);
        msgTxt.value = '';
}
sndBtn.onclick = ()=>{
    if(msgTxt.value != ''){
        sendMessage();
    }
}


// Check if not Empty then valid
var e
msgTxt.addEventListener('keyup' , (event)=>{
    if(event.keyCode == 13){
        if(msgTxt.value != ''){
            sendMessage();
        }
    }
    btnOpacity();
} );
function btnOpacity() {
    if(msgTxt.value == ''){
        sndBtn.style.opacity = '0.55'
        sndBtn.style.cursor = 'default'
    }else{
        sndBtn.style.opacity = '1'
        sndBtn.style.cursor = 'pointer'
    }
}
btnOpacity();
messageParent.scroll(0 , messageParent.offsetHeight);


// messageRef.onSnapshot((snap)=>{snap.docChanges().forEach((a)=>{console.log(a.doc.data())})})