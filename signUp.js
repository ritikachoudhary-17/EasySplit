
// JavaScript code for the login/signup functionality using Firebase
// Variables to access HTML elements
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const registerButton = document.getElementById('register');
const loginButton = document.getElementById('login');
const container = document.getElementById('container');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDshulBjmnkN_GGTRVWtUzj7lh3QmfNLCg",
    authDomain: "easysplit-webbillsplitter.firebaseapp.com",
    databaseURL: "https://easysplit-webbillsplitter-default-rtdb.firebaseio.com",
    projectId: "easysplit-webbillsplitter",
    storageBucket: "easysplit-webbillsplitter.appspot.com",
    messagingSenderId: "1087912578303",
    appId: "1:1087912578303:web:8fbd8c8a7acf16641c90ca"
};
//initialise firebase 
firebase.initializeApp(firebaseConfig);

//initialize variables related to firebase
const auth = firebase.auth();
const database = firebase.database();

// Event listener for the sign-up button
registerButton.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email1').value;
    const password = document.getElementById('password1').value;

    //validate email
    expression = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    if (expression.test(email) == false) {
        alert("Enter a Valid Email");
        return;
    }
    //firebase only accepts that password which having length greater than 6
    if (password.length < 6) {
        alert("Please Enter atleast 6 digit password");
        return;
    }

    //username feild should not be null
    if (username == null || username.length <= 0) {
        alert("Name is required!!!");
        return;
    }

    // Create a new user with email and password in Firebase
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {

            var user = auth.currentUser
            //adding this user to firebase database
            var database_ref = database.ref();
            //create user Data
            var user_data = {
                user_name: username,
                user_email: email
            }
            //console.log(database_ref);
            database_ref.child('users/' + user.uid).set(user_data);
            let formId = document.getElementById('form-id');
            formId.reset();
            alert("successfully Register .... please login once");


        }
        )
        .catch((error) => {
            //firebase will use this to alert of its error
            var error_code = error_code;
            var error_message = error.message;
            alert(`${error_code}: ${error_message}`)
        }
        )
});

loginButton.addEventListener('click', () => {
    const email = document.getElementById('email2').value;
    const password = document.getElementById('password2').value;

    //validate email
    expression = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    if (expression.test(email) == false) {
        alert("Enter a Valid Email");
        return;
    }
    //firebase only accepts that password which having length greater than 6
    if (password.length < 6) {
        alert("Please Enter atleast 6 digit password");
        return;
    }

    // Sign in the user using Firebase authentication
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {

            var user = auth.currentUser;
            alert("logged in");
            localStorage.setItem('logged', 1);
            localStorage.setItem('uid', user.uid);
            window.location.assign("index.html");
        })
        .catch(
            (error) => {
                //firebase will use this to alert of its error
                var error_code = error_code;
                var error_message = error.message;
                alert(`${error_code}: ${error_message}`)
            }
        )


});

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

function forgetPassword() {
    var confirmEmail = window.prompt(" confirm your email for recovery");
    auth.sendPasswordResetEmail(confirmEmail)
        .then(() => {
            alert("Password Reset mail sent to your email ......Please  Sign in with new password ")
        })
        .catch((error) => {
            alert(error.message);
        }
        )
}
