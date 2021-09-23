//                  Page Information

// Getting Form Values

// Login info
var email = document.querySelector('.email');
var password = document.querySelector('.password');

// signUp info
var uName = document.querySelector('.name');
var regEmail = document.querySelector('.regEmail');
var regPass = document.querySelector('.regPass');

//        FireBase

const firebaseConfig = {
  apiKey: "AIzaSyAFEIMiMQcE8cB_Ms7dJYA2F4U2Mw4ddGQ",
  authDomain: "tahir-ff29f.firebaseapp.com",
  databaseURL: "https://tahir-ff29f-default-rtdb.firebaseio.com",
  projectId: "tahir-ff29f",
  storageBucket: "tahir-ff29f.appspot.com",
  messagingSenderId: "660400590737",
  appId: "1:660400590737:web:c32bef823b2541a39a5430",
  measurementId: "G-8KFK8LSCV0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

// AUTHENTICATION

function login(){
    var loginEmail = email.value;
    var loginPassword = password.value;

if(loginEmail != '' && loginPassword != ''){
    
    auth.signInWithEmailAndPassword(loginEmail , loginPassword)
    .catch((err)=>{
        showErrMsg(err.message)
    })

}else{
    showErrMsg('All Fields are Required !')
}
};
var data;
function signup(){
    var signUpEmail = regEmail.value;
    var signUpPass = regPass.value;

if(uName.value !='' && signUpEmail.value !='' && signUpPass.value !=''){

    auth.createUserWithEmailAndPassword(signUpEmail , signUpPass)
    .then(()=>{
        firestore.collection('usersData').doc(auth.currentUser.uid).set({
            name : capitalFirstLetter(uName),
            level : 1,
            levelcleared : 0,
            lastGamePlayed : new Date(),
            newUser : true
        });
    })
    .catch((err)=>{
        showErrMsg(err.message)
    })

}else{
    showErrMsg('All Fields are Required !')
}
}
var level = 1;
var levelcleared = 0;
var firestoreCollection;
var animationContainer = document.querySelector('.animationContainer');
auth.onAuthStateChanged((user)=>{
    document.querySelector('.loader').style.display = 'none'
    if(user){
        var userId = auth.currentUser.uid;
        firestoreCollection = firestore.collection('usersData').doc(auth.currentUser.uid);
        firestore.collection('usersData').doc(userId).get().then((querySnapshot)=>{
            var userData = querySnapshot.data();
            if(userData.level != undefined && userData.levelcleared != undefined){
                level = userData.level , levelcleared = userData.levelcleared
                firestoreCollection.update({lastGamePlayed : new Date()})
            }else{
                firestoreCollection.update({
                    level : 1,
                    levelcleared : 0,
                    lastGamePlayed : new Date(),
                })
            }
            data = userData;
            usersData();
            if(data.newUser){
                animationContainer.style.display = 'flex'
                document.querySelector('.userNameAnimation').innerText = firstname(data.name);
                setTimeout(()=>{
                    animationContainer.style.display = 'none'
                    setTimeout(()=>{
                        levelNumToLevel(level , true);
                        levelBox();
                    },1000)
                },15500);
            }else{
                animationContainer.style.display = 'none'
                levelNumToLevel(level , true);
                if(data.levelcleared == 10){
                    showBalloonsInfo(); showLevelsPage();
                }
                levelBox();
            }

            document.querySelector('.wlcome').innerText = userData.name;
        })
        showMainPage();
    }else{
        showAuthPage();
    }
})
function logout(){
    auth.signOut();
}


//       HELPERS FUNCTIONS

// Capital First Letter
function capitalFirstLetter(value){
    if(value != undefined && value.length>2){
        var firstChar = value.slice(0,1);
        var otherChars = value.slice(1)

        firstChar = firstChar.toUpperCase();
        fullName = firstChar + otherChars;
        return fullName;
    }else{
        return value;
    }
}
// First Name Split
function firstname(value) {
    if(value != undefined && value.indexOf(' ') != -1){
        var firsName = value.slice(0 , value.indexOf(' '))
        return capitalFirstLetter(firsName)
    }else{
        return capitalFirstLetter(value)
    }
}

// Show & hide error message on form
function showErrMsg(msg){
    var errMsg = document.querySelector('.errMsg');
    errMsg.innerHTML = msg;
    setTimeout(()=>{
        errMsg.innerHTML = '&nbsp;'
    },2500)
};

// Toggle between SignUp & Login Forms
var formHeding = document.querySelector('.formHeding');
var loginForm = document.querySelector('.loginForm');
var regForm = document.querySelector('.regForm');
function showRegForm(){
    loginForm.style.display = 'none'
    regForm.style.display = 'flex'
    formHeding.innerText = 'Registor'
}
function showLoginForm(){
    regForm.style.display = 'none'
    loginForm.style.display = 'flex'
    formHeding.innerText = 'Login'
}

// Toggle between auth & main page
var inputForm = document.querySelector('.inputForm')
var mnPage = document.querySelector('.mnPage')
function showAuthPage() {
    inputForm.style.display = 'block'
    mnPage.style.display = 'none'
}
function showMainPage() {
    inputForm.style.display = 'none'
    mnPage.style.display = 'flex'
}


//        POP BALLOONS JAVASCRIPT

colors = ['yellow' , 'black' , 'red' , 'blue' , 'green'];
var gamePopUp = document.querySelector('.gamePopUp');
var popTxt = document.querySelector('.popTxt');
var lives = 3;
var a;
var color = 'yellow';
var currentColor = 0;
var target = 0;
var poppedBalloon = 0;

// here Main game functions

//   pop ballon & decrease lives if wrong
function popblln(id , event) {
    
    var ballon = event.target
    var blnChild = ballon.childNodes[0];
    if(id != 'popped'){

            ballon.classList.add('poppedBalloon')
            blnChild.style.color = id;
            blnChild.innerText = 'POP !'
            a = event.target;
            event.target.id = 'popped'
        if(id == color){
            currentColor = currentColor - 1;
            poppedBalloon = poppedBalloon + 1;
            if(target - poppedBalloon > 1){
                popClrBln.innerHTML = `Pop ${target - poppedBalloon} ${color} Balloons`;
            }else{
                popClrBln.innerHTML = `Pop ${target - poppedBalloon} ${color} Balloon`;
            }
            if(poppedBalloon == target){
                document.querySelector('.gameWin h2').innerHTML = `Congrats , ${data.name} you've cleared ${currentLevel} Level !`
                document.querySelector('.gameOver').style.display = 'none'
                document.querySelector('.gameWin').style.display = 'flex'
                gamePopUp.style.display = 'flex'
            }
        }else{
            decLives();
        }
        time = 1200;
        if(currentLevel == 10){ time = 150}else
        if(currentLevel == 9){ time = 250}else
        if(currentLevel == 8){ time = 300}else
        if(currentLevel > 7){ time = 500}else
        if(currentLevel > 5){ time = 800; checkIfCurrentColorBalloonsAreLess();}
        if(currentLevel > 3){
            var blColor = generateColor();
            setTimeout(()=>{
                ballon.classList.remove('poppedBalloon');
                ballon.classList.remove('black');
                ballon.classList.remove('blue');
                ballon.classList.remove('red');
                ballon.classList.remove('yellow');
                ballon.classList.remove('green');
                ballon.id = blColor;
                ballon.classList.add(blColor)
                blnChild.innerText =''
            } , time)
            if(blColor == color){
                currentColor = currentColor + 1;
            }
        }
    }
    if(currentLevel > 5){ checkIfCurrentColorBalloonsAreLess();}
}
function decLives() {
    if(lives > 1){
    lives = lives-1
    livesUI(lives);
    }else{
        lives = lives-1
        livesUI(lives);

        document.querySelector('.gameOver').style.display = 'block'
        document.querySelector('.gameWin').style.display = 'none'

        gamePopUp.style.display = 'flex'
    }
};
function livesUI(liv = 3) {
    var hearts = document.querySelectorAll('.hrt');

    var unBroken = 'fa-heart'
    var broken = 'fa-heart-broken'
    // to add broken heart classes
    for(var i=0; i<hearts.length; i++){
        hearts[i].classList.add(broken)
        hearts[i].classList.remove(unBroken)
    };
    // to add unbroken hearts according to lives
    for(var i=0; i<liv; i++){
        hearts[i].classList.add(unBroken)
        hearts[i].classList.remove(broken)
    };
};  livesUI();
function checkIfCurrentColorBalloonsAreLess () {
    if(currentColor < 3){
        var c = document.querySelectorAll('.balloon')
        for(var i = 0; i < 3; i++){
            var selectedElement = c [ Math.floor(Math.random() * c.length) ]
            selectedElement.classList.remove('poppedBalloon');
            selectedElement.classList.remove('black');
            selectedElement.classList.remove('blue');
            selectedElement.classList.remove('red');
            selectedElement.classList.remove('yellow');
            selectedElement.classList.remove('green');
            selectedElement.id = color;
            selectedElement.classList.add(color);
            currentColor = currentColor + 1;
        }
    }
};

// show color on page and run generate ballon funcion
function mnBalloons(bllnsQnty , margin) {
    currentColor = 0
    color = generateColor();
    popClrBln = document.querySelector('.popClrBln');
    popClrBln.innerHTML = `Pop $ ${color} Balloons`;
    generateBalloons(bllnsQnty , margin);
};

function generateColor(){
    var randomColor =  colors[Math.floor(Math.random() * 5 )];
    return randomColor;
};
function generateBalloons(bllnsQnty , margin) {

    document.querySelector('.mnBalloons').innerHTML = '';
    
        for(var i = 0; i< bllnsQnty; i++){
            appendBalloon(margin);
        };
        checkIfCurrentColorBallonExists ()

};
function checkIfCurrentColorBallonExists () {
    var balloonsExists = 0;
    var generatedBalloons = document.querySelectorAll('.balloon');
    for(var  i=0; i<generatedBalloons.length; i++){
        if(generatedBalloons[i].id == color){
            balloonsExists = balloonsExists + 1 ;
        }
    }
    if(balloonsExists < 2){
        currentColor = 0;
        for(var i=0; i<3; i++){
            rndmNm = Math.floor( Math.random() * generatedBalloons.length );
            b = generatedBalloons[rndmNm];
            b.classList.remove('poppedBalloon');
            b.classList.remove('black');
            b.classList.remove('blue');
            b.classList.remove('red');
            b.classList.remove('yellow');
            b.classList.remove('green');
            b.id = color;
            b.classList.add(color);
            currentColor = currentColor + 1;
        };
    }

}

function appendBalloon(margin){

    var rndmClr = generateColor();
    if(rndmClr == color){
        currentColor = currentColor + 1
    }
    if(currentLevel > 6){
        var animations = ['leftHard' , 'rightHard' , 'topHard' , 'bottomHard'];
        var rndm = Math.floor(Math.random() * animations.length);
        var a = animations[rndm];
    }
    if(currentLevel > 4){
        var animations = ['left' , 'right' , 'top' , 'bottom'];
        var rndm = Math.floor(Math.random() * animations.length);
        var a = animations[rndm];
    }else{
        a = 'stop'
    }
    var id = rndmClr;


    var blnParent = document.querySelector('.mnBalloons');
    var blnDiv = `<div class="balloon ${rndmClr} ${a}" style="margin:${margin}px" id="${id}" onmouseover="popblln(this.id , event)"><span></span></div>`

    blnParent.innerHTML += blnDiv;
    popClrBln.innerHTML = `Pop ${target} ${color} Balloons`;
    target = targetToReach();
}


//          LEVELS

var lvlTxt = document.querySelector('.lvl');
var currentLevel = 1;
// Levels Of the Game
function level1() {
    currentLevel = 1
    currentColor = 0;
    poppedBalloon = 0;
    lvlTxt.innerHTML = 'Level 1'
    mnBalloons(15 , 20);

}
function level2() {
    currentLevel = 2
    currentColor = 0;
    poppedBalloon = 0;
    lvlTxt.innerHTML = 'Level 2'
    mnBalloons(20 , 11);
}
function level3() {
    currentLevel = 3
    currentColor = 0;
    poppedBalloon = 0;
    lvlTxt.innerHTML = 'Level 3'
    mnBalloons(23 , 8);
}
function level4() {
    currentLevel = 4
    currentColor = 0;
    poppedBalloon = 0;
    lvlTxt.innerHTML = 'Level 4'
    mnBalloons(25 , 8);
}
function level5() {
    currentLevel = 5
    currentColor = 0;
    poppedBalloon = 0;
    lvlTxt.innerHTML = 'Level 5'
    mnBalloons(29 , 6);
}
function level6() {
    currentLevel = 6
    currentColor = 0;
    poppedBalloon = 0;
    lvlTxt.innerHTML = 'Level 6'
    mnBalloons(30 , 7);
    var c = document.querySelectorAll('.balloon')
    setInterval(()=>{

        var rndmNm = Math.floor(Math.random() * c.length)
        var b = c[rndmNm]
        // The Element which is Randomly Selected        
        if(b.id == color && currentColor > 1){
            currentColor = currentColor - 1;
        }

        var blColor = generateColor();
        if(currentColor > 2 && blColor != color){
            
        b.classList.remove('poppedBalloon');
        b.classList.remove('black');
        b.classList.remove('blue');
        b.classList.remove('red');
        b.classList.remove('yellow');
        b.classList.remove('green');
        b.id = blColor;
        b.classList.add(blColor)
    };
    } , 2500)
    // Balloons Must be greater than 6
    for(var i = 0; i < 6; i++){
        var selectedElement = c [ Math.floor(Math.random() * c.length) ]
        selectedElement.classList.remove('poppedBalloon');
        selectedElement.classList.remove('black');
        selectedElement.classList.remove('blue');
        selectedElement.classList.remove('red');
        selectedElement.classList.remove('yellow');
        selectedElement.classList.remove('green');
        selectedElement.id = color;
        selectedElement.classList.add(color);
        currentColor = currentColor + 1;
        target = targetToReach() - 4;
        popClrBln.innerHTML = `Pop ${target - poppedBalloon} ${color} Balloons`;
    }
}
function level7() {
    currentLevel = 7
    currentColor = 0;
    poppedBalloon = 0;
    lvlTxt.innerHTML = 'Level 7'
    mnBalloons(30 , 7);
    var c = document.querySelectorAll('.balloon')
    setInterval(()=>{

        var rndmNm = Math.floor(Math.random() * c.length)
        var b = c[rndmNm]
        // The Element which is Randomly Selected        
        if(b.id == color && currentColor > 1){
            currentColor = currentColor - 1;
        }

        var blColor = generateColor();
        if(currentColor > 2 && blColor != color){
            
        b.classList.remove('poppedBalloon');
        b.classList.remove('black');
        b.classList.remove('blue');
        b.classList.remove('red');
        b.classList.remove('yellow');
        b.classList.remove('green');
        b.id = blColor;
        b.classList.add(blColor)
    };
    } , 2500)
    // Balloons Must be greater than 6
    for(var i = 0; i < 6; i++){
        var selectedElement = c [ Math.floor(Math.random() * c.length) ]
        selectedElement.classList.remove('poppedBalloon');
        selectedElement.classList.remove('black');
        selectedElement.classList.remove('blue');
        selectedElement.classList.remove('red');
        selectedElement.classList.remove('yellow');
        selectedElement.classList.remove('green');
        selectedElement.id = color;
        selectedElement.classList.add(color);
        currentColor = currentColor + 1;
        target = targetToReach() - 2;
        popClrBln.innerHTML = `Pop ${target - poppedBalloon} ${color} Balloons`;

    };
    setTimeout(()=>{
        checkIfCurrentColorBalloonsAreLess ();
    } , 3000)
}
function level8() {
    currentLevel = 8
    currentColor = 0;
    poppedBalloon = 0;
    lvlTxt.innerHTML = 'Level 8'
    mnBalloons(30 , 7);
    var c = document.querySelectorAll('.balloon')
    setInterval(()=>{

        var rndmNm = Math.floor(Math.random() * c.length)
        var b = c[rndmNm]
        // The Element which is Randomly Selected        
        if(b.id == color && currentColor > 1){
            currentColor = currentColor - 1;
        }

        var blColor = generateColor();
        if(currentColor > 2 && blColor != color){
            
        b.classList.remove('poppedBalloon');
        b.classList.remove('black');
        b.classList.remove('blue');
        b.classList.remove('red');
        b.classList.remove('yellow');
        b.classList.remove('green');
        b.id = blColor;
        b.classList.add(blColor)
    };
    } , 2500);
    // Balloons Must be greater than 7
    for(var i = 0; i < 7; i++){
        var selectedElement = c [ Math.floor(Math.random() * c.length) ]
        selectedElement.classList.remove('poppedBalloon');
        selectedElement.classList.remove('black');
        selectedElement.classList.remove('blue');
        selectedElement.classList.remove('red');
        selectedElement.classList.remove('yellow');
        selectedElement.classList.remove('green');
        selectedElement.id = color;
        selectedElement.classList.add(color);
        currentColor = currentColor + 1;
        target = targetToReach() - 1;
        popClrBln.innerHTML = `Pop ${target - poppedBalloon} ${color} Balloons`;
    };
        checkIfCurrentColorBalloonsAreLess ();
}
function level9() {
    currentLevel = 9
    currentColor = 0;
    poppedBalloon = 0;
    lvlTxt.innerHTML = 'Level 9'
    mnBalloons(30 , 7);
    var c = document.querySelectorAll('.balloon')
    setInterval(()=>{

        var rndmNm = Math.floor(Math.random() * c.length)
        var b = c[rndmNm]
        // The Element which is Randomly Selected        
        if(b.id == color && currentColor > 1){
            currentColor = currentColor - 1;
        }

        var blColor = generateColor();
        if(currentColor > 2 && blColor != color){
            
        b.classList.remove('poppedBalloon');
        b.classList.remove('black');
        b.classList.remove('blue');
        b.classList.remove('red');
        b.classList.remove('yellow');
        b.classList.remove('green');
        b.id = blColor;
        b.classList.add(blColor)
    };
    } , 2500);
    // Balloons Must be greater than 7
    for(var i = 0; i < 7; i++){
        var selectedElement = c [ Math.floor(Math.random() * c.length) ]
        selectedElement.classList.remove('poppedBalloon');
        selectedElement.classList.remove('black');
        selectedElement.classList.remove('blue');
        selectedElement.classList.remove('red');
        selectedElement.classList.remove('yellow');
        selectedElement.classList.remove('green');
        selectedElement.id = color;
        selectedElement.classList.add(color);
        currentColor = currentColor + 1;
        target = targetToReach() + 2;
        popClrBln.innerHTML = `Pop ${target - poppedBalloon} ${color} Balloons`;
    };
        checkIfCurrentColorBalloonsAreLess ();
}
function level10() {
    currentLevel = 10
    currentColor = 0;
    poppedBalloon = 0;
    lvlTxt.innerHTML = 'Level 10'
    mnBalloons(30 , 7);
    var c = document.querySelectorAll('.balloon')
    setInterval(()=>{

        var rndmNm = Math.floor(Math.random() * c.length)
        var b = c[rndmNm]
        // The Element which is Randomly Selected        
        if(b.id == color && currentColor > 1){
            currentColor = currentColor - 1;
        }

        var blColor = generateColor();
        if(currentColor > 2 && blColor != color){
            
        b.classList.remove('poppedBalloon');
        b.classList.remove('black');
        b.classList.remove('blue');
        b.classList.remove('red');
        b.classList.remove('yellow');
        b.classList.remove('green');
        b.id = blColor;
        b.classList.add(blColor)
        // putting one Random color to selected element
    };
    } , 2500)
    // Balloons Must be greater than 7
    for(var i = 0; i < 7; i++){
        var selectedElement = c [ Math.floor(Math.random() * c.length) ]
        selectedElement.classList.remove('poppedBalloon');
        selectedElement.classList.remove('black');
        selectedElement.classList.remove('blue');
        selectedElement.classList.remove('red');
        selectedElement.classList.remove('yellow');
        selectedElement.classList.remove('green');
        selectedElement.id = color;
        selectedElement.classList.add(color);
        if(selectedElement.id != color){
            currentColor = currentColor + 1;
        }
        target = targetToReach() + 4;
        popClrBln.innerHTML = `Pop ${target - poppedBalloon} ${color} Balloons`;
    };
        checkIfCurrentColorBalloonsAreLess ();
}
//          CHANGE LEVEL THROUGH NUMBER

var resumedLevel = undefined;
var changes = false;
function levelNumToLevel(level , changes) {
    if(level == 10){
        if(changes){
            levelcleared = 9;
            currentLevel = 10
        }
        level10();
    }else if(level == 9){
        if(changes){
            levelcleared = 8;
            currentLevel = 9
        };
        level9();
    }else if(level == 8){
        if(changes){
            levelcleared = 7;
            currentLevel = 8
        };
        level8();
    }else if(level == 7){
        if(changes){
            levelcleared = 6;
            currentLevel = 7
        };
        level7();
    }else if(level == 6){
        if(changes){
            levelcleared = 5;
            currentLevel = 6
        };
        level6();
    }else if(level == 5){
        if(changes){
            levelcleared = 4;
            currentLevel = 5
        };
        level5();
    }else if(level == 4){
        if(changes){
            levelcleared = 3;
            currentLevel = 4
        };
        level4();
    }else if(level == 3){
        if(changes){
            levelcleared = 2;
            currentLevel = 3
        };
        level3();
    }else if(level == 2){
        if(changes){
            levelcleared = 1;
            currentLevel = 2
        };
        level2();
    }else if(level == 1){
        if(changes){
            levelcleared = 0;
            currentLevel = 1
        };
        level1();
    }
    if(level == 0){
        if(changes){
            currentLevel = 1
            levelcleared = 0;
        };
        level1();
    };
    document.querySelector('.blnLdr').style.display = 'none'
    showOverlay();
    showBalloonsGame();
    levelBox();

//  AFTER COMPLETED ALL LEVELS
    if(currentLevel == 10){
        if(changes){
            levelcleared = 10;
            currentLevel = 10
        }
        level10();
    }
};
//         FOR INFORMATION PAGE
function levelBox() {
    var levelBoxes = document.querySelectorAll('.lvlBox');
    for(var i = 0; i<level; i++){
        levelBoxes[i].classList.remove('closed')
        levelBoxes[i].classList.remove('toPlay')
        levelBoxes[i].classList.add('open')
    }
    if(levelcleared > 1){var  emoji = '😃'; var a = 's'}else{var emoji = '😊'; var a = ''}
    document.querySelector('.balloonsInfo p').innerHTML = `${levelcleared} level${a} Completed ${emoji}`

    if(levelcleared == 10){
        levelBoxes[levelBoxes.length - 1].classList.remove('closed')
        levelBoxes[levelBoxes.length - 1].classList.remove('closed')
        levelBoxes[levelBoxes.length - 1].classList.add('open')

        document.querySelector('.balloonsInfo p').innerHTML = `Congrats , you've Completed ${levelcleared} levels 🔥`
    }else{
        levelBoxes[levelcleared].classList.add('toPlay')
    }
}
function showBalloonsInfo() {
    resumedLevel = currentLevel;
    checkIfGameIsResume();
    document.querySelector('.balloonsContainer').style.display = 'none'
    document.querySelector('.balloonsInfo').style.display = 'flex'
}
function showBalloonsGame() {
    document.querySelector('.balloonsContainer').style.display = 'flex'
    document.querySelector('.balloonsInfo').style.display = 'none'
    showOverlay();
}
function checkIfGameIsResume() {
    resumeDiv = document.querySelector('.resume')
     if(resumedLevel == undefined){
         resumeDiv.innerHTML = '';
     }else{
         resumeDiv.innerHTML =
            `<div onclick="showBalloonsGame()">
            <span>Resume Level ${currentLevel}</span>
            <i class="fas fa-play"></i>
            </div>`
     }
}
checkIfGameIsResume();
function checkIfLevelCompleted(elementLevel) {
    // Getting innerText
    if(elementLevel.slice(-1) == 0){
      var lvl = elementLevel.slice(-2)
    }else{
        var lvl = elementLevel.slice(-1)
    }
    // Checking
    if(lvl <= level){
        levelNumToLevel(lvl , false)
    }else{
        let lvlTxt = document.querySelector('.balloonsInfo p');
        let copiedTxt = lvlTxt.innerText;
        lvlTxt.innerText = `This Level is Currently Locked 😏`
        setTimeout(()=>{
            lvlTxt.innerText = copiedTxt;
        },4500)
    }
}
// SET TARGET
function targetToReach() {
    return  currentColor;
}

//      Retry
function playAgain(){
    currentColor = 0;
    lives = 3
    livesUI(lives);
    levelNumToLevel(level , false)
    gamePopUp.style.display = 'none';
    showOverlay();

}
//  SHOW OVERLAY FOR MOUSE OUT
function showOverlay() {
    ntHover = document.querySelector('.ntHover');
    ntHover.style.display = 'flex'
    setTimeout(() => {
        ntHover.style.display = 'none'
    }, 1300);
}
//      CHANGE THE LEVEL
function changeLevel() {
    ntHover = document.querySelector('.ntHover');
    gamePopUp.style.display = 'none'
    ntHover.style.display = 'flex'
    lives = 3;
    livesUI(lives);

    if(currentLevel == 10){
        updateLevelsToFirestore(10, 10);
        level1()
    }
    else if(currentLevel == 9){
        if(level >= data.level){
            updateLevelsToFirestore(10, 9);
        }
        level10()
    }else if(currentLevel == 8){
        if(level >= data.level){
            updateLevelsToFirestore(9 , 8);
        }
        level9()
    }else if(currentLevel == 7){
        if(level >= data.level){
            updateLevelsToFirestore(8 , 7);
        }
        level8()
    }else if(currentLevel == 6){
        if(level >= data.level){
            updateLevelsToFirestore(7 , 6);
        }
        level7()
    }else if(currentLevel == 5){
        if(level >= data.level){
            updateLevelsToFirestore(6 , 5);
        }
        level6()
    }else if(currentLevel == 4){
        if(level >= data.level){
            updateLevelsToFirestore(5 , 4);
        }
        level5()
    }else if(currentLevel == 3){
        if(level >= data.level){
            updateLevelsToFirestore(4 , 3);
        }
        level4()
    }else if(currentLevel == 2){
        if(level >= data.level){
            updateLevelsToFirestore(3 , 2);
        }
        level3()
    }else if(currentLevel == 1){
        if(level > data.level){
            updateLevelsToFirestore(2 , 1);
        }
        level2()
    }

    showOverlay();
    levelBox();
    firestoreCollection.update({
        newUser : false
    })
}
//  SAVE INFORMATION TO FIRESTORE
function updateLevelsToFirestore(lvl , lvlclrd) {
    firestoreCollection.update({
        level : lvl,
        levelcleared : lvlclrd
    });
    data.level = lvl;
    data.levelcleared = lvlclrd
    level = lvl;
    levelcleared = lvlclrd;
    usersData();
};
// SHOW USER DATA ON PAGE
function usersData(){ 
    document.querySelector('.userName').innerText = data.name;
    document.querySelector('.cmpltdLvl').innerText = data.levelcleared;
    document.querySelector('.crntLvl').innerText = data.level;
    document.querySelector('.lastPlayed').innerText = data.lastGamePlayed.toDate();
    document.querySelector('.userId').innerText = auth.currentUser.uid;
    if(auth.currentUser.email == 'tahirtv.islam@gmail.com' || auth.currentUser.email == 'tahir@gmail.com'){
    document.querySelector('.userName').innerText += ' (Admin)';
    }
    levelBox();
}
//  TOGGLE INFORMATION AND LEVEL PAGES
var userInfo = document.querySelector('.userInfo');
var levelsInfo = document.querySelector('.levelsInfo');
var levelsInfoHeading = document.querySelector('.header h3');
var userInfoHeading = document.querySelectorAll('.header h3')[1];
function showInfoPage() {
    userInfo.style.display = 'block'
    levelsInfo.style.display = 'none'

    userInfoHeading.classList.add('active');
    levelsInfoHeading.classList.remove('active');
};
function showLevelsPage() {
    userInfo.style.display = 'none'
    levelsInfo.style.display = 'flex'

    userInfoHeading.classList.remove('active');
    levelsInfoHeading.classList.add('active');
};
function restoreSettings() {
    updateLevelsToFirestore(1 , 0);
    levelBox();
    level1();
    showBalloonsGame();
};