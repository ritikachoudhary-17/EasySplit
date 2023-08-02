
// JavaScript code for handling user login/logout
// Variables to access HTML elements
const logout = document.getElementById('Logout');
const register = document.getElementById('Register');

//check if user logged in or not and work accordingly
window.onload = function () {
  const flag = localStorage.getItem('logged');
  if (flag == 1) {
    register.setAttribute('hidden', 'hidden');
    logout.removeAttribute('hidden');
  }
}
//----------end-----------------

// Function to handle user logout
function logoutfunc() {
  localStorage.setItem('logged', 0);
  localStorage.setItem('uid', null);
  logout.setAttribute('hidden', 'hidden');
  register.removeAttribute('hidden');
}
