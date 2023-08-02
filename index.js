
// JavaScript code goes here
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
const database = firebase.database();

const logout = document.getElementById('Logout');
const register = document.getElementById('Register');
const prevTrip = document.getElementById('prevTrip');
const details = document.getElementById('details');

//check if user logged in or not and work accordingly
window.onload = function () {
  const flag = localStorage.getItem('logged');
  const uid = localStorage.getItem('uid');
  if (flag == 1) {
    register.setAttribute('hidden', 'hidden');
    logout.removeAttribute('hidden');
    prevTrip.removeAttribute('hidden');

    var user_ref = database.ref('users/' + uid);
    user_ref.on('value', (snap) => {
      var data = snap.val();
      const name = document.getElementById('nameOfUser');
      name.textContent = data.user_name;
      if (data.trips == undefined) {
        details.textContent = 'NO HISTORY FOUND';
      } else {
        details.textContent = '';
        for (var tripName in data.trips) {
          addHistory(tripName);
        }
      }
    })
  }
}
//---------------------end---------------------

function addHistory(tripName) {
  const newDiv = document.createElement('div');
  newDiv.id = `box-${tripName}`;
  newDiv.classList.add('new-div');
  newDiv.setAttribute('onClick', `openHistory( '${tripName}')`);
  newDiv.innerHTML = `
  <h3>${tripName}</h3> 
  <button id="remove" onclick="removeHistory('${tripName}')">Remove</button>
  `;

  details.appendChild(newDiv);
}
function openHistory(tripName) {

  url = 'getStarted.html?name=' + encodeURIComponent(tripName);
  window.location.assign(url);
}

function logoutfunc() {
  localStorage.setItem('logged', 0);
  localStorage.setItem('uid', null);
  logout.setAttribute('hidden', 'hidden');
  register.removeAttribute('hidden');
  prevTrip.setAttribute('hidden', 'hidden');
}

function testJS() {
  var b = document.getElementById('tripname').value,
    url = 'getStarted.html?name=' + encodeURIComponent(b);

  document.location.href = url;
}

function removeHistory(tripName) {
  const uid = localStorage.getItem('uid');
  const tripRef = database.ref(`users/${uid}/trips/${tripName}`);

  tripRef.remove()
    .then(() => {
      // Update the UI after removing the history
      const boxToRemove = document.getElementById(`box-${tripName}`);
      if (boxToRemove) {
        boxToRemove.remove();
      }
    })
    .catch((error) => {
      console.error('Error removing history:', error);
    });
}
