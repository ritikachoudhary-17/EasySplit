
// JavaScript code goes here
const logout = document.getElementById('Logout');
const register = document.getElementById('Register');
let personInputsContainer = document.getElementById('person-inputs');
var str = "No payments needed. Everyone paid an equal amount.";
let tripName, props, uid;
db = [];

//------------------------useful firebase work--------------------------------------
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
//-----------------------------------end------------------------------------------------

const addPersonButton = document.getElementById('add-person-btn');
addPersonButton.addEventListener('click', addPersonInput);

const calculateButton = document.getElementById('calculate-btn');
calculateButton.addEventListener('click', calculateBill);

const saveButton = document.getElementById('pdf-btn');
saveButton.addEventListener('click', generatePdf);

const serverButton = document.getElementById('server-btn');
serverButton.addEventListener('click', saveToServer);

const removePersonButton = document.getElementById('remove-person-btn');
removePersonButton.addEventListener('click', removePersonInput);

window.onload = function () {
  //check if user logged in or not and work accordingly
  const flag = localStorage.getItem('logged');
  uid = localStorage.getItem('uid');

  if (flag == 1) {
    register.setAttribute('hidden', 'hidden');
    logout.removeAttribute('hidden');
    setFields();
  }
  //--------------------------end-----------------------

  var url = document.location.href,
    params = url.split('?')[1].split('&'),
    data = {}, tmp;
  for (var i = 0, l = params.length; i < l; i++) {
    tmp = params[i].split('=');
    data[tmp[0]] = tmp[1];
  }
  tripName = data.name;
  document.getElementById('here').innerHTML = data.name;
}
function logoutfunc() {
  localStorage.setItem('logged', 0);
  localStorage.setItem('uid', null);
  logout.setAttribute('hidden', 'hidden');
  register.removeAttribute('hidden');
}

function setVisibility_of_UPI(id, upi) {

  let element = document.getElementById(`upi-btn-${id}`);
  let text = element.textContent;
  let upiEle = document.getElementById(`display-upi-${id}`);
  // console.log(upiEle);

  if (text === "Show UPI Id") {
    element.textContent = "Hide UPI Id";
    element.style.backgroundColor = "#aa1754";
    upiEle.textContent = `${upi}`;
  } else {
    element.textContent = "Show UPI Id";
    element.style.backgroundColor = "#7157c7";
    upiEle.textContent = '';
  }

}

function addPersonInput() {
  let numPersons = personInputsContainer.childElementCount;

  const newPersonInput = document.createElement('div');
  newPersonInput.id = `person-${numPersons + 1}`;
  newPersonInput.classList.add('input-group');
  newPersonInput.innerHTML = `
    <h3>Person ${numPersons + 1}:</h3>
    <input type="text" id="userName-${numPersons + 1}" placeholder="Enter name">
    <input type="text" id="userUPI-${numPersons + 1}" placeholder="example23@ybl">
    <div id="amount-${numPersons + 1}">
    <table>
      <tr>
        <th>Purpose</th>
        <th>Amount</th>
      </tr>
      <tr>
        <td><input type="text" class="userPurpose" placeholder="Enter Purpose"></td>
        <td><input type="number" class="userAmount" placeholder="Enter amount"></td>
      </tr>
    </table>
    <button class="add-col-btn" onclick="addCol(${numPersons + 1})">Add Column</button>
    <button class="remove-col-btn" onclick="removeCol(${numPersons + 1})">Remove Column</button>
    </div>
  `;

  personInputsContainer.appendChild(newPersonInput);
}

function removePersonInput() {
  let numPersons = personInputsContainer.childElementCount;
  document.getElementById(`person-${numPersons}`).remove();
}

function addCol(n) {

  let amountDiv = document.getElementById(`amount-${n}`);
  let table = amountDiv.querySelector('table');
  const row = document.createElement('tr');
  row.innerHTML =
    `<td><input type="text" class="userPurpose" placeholder="Enter Purpose"></td>
        <td><input type="number" class="userAmount" placeholder="Enter amount"></td>`

  table.appendChild(row);

}

function removeCol(n) {
  let amountDiv = document.getElementById(`amount-${n}`);
  let table = amountDiv.querySelector('table');

  var rowCount = amountDiv.getElementsByTagName('tr').length;
  console.log(rowCount);

  if (rowCount > 1) {
    table.deleteRow(rowCount - 1);
  }

}

function addPersonResult(content, upi) {
  const personResultContainer = document.getElementById('person-results');
  const numResults = personResultContainer.childElementCount;
  const passing = `'${upi}'`;

  const newPersonResult = document.createElement('div');
  newPersonResult.classList.add('result-group');
  newPersonResult.innerHTML = `
    <div id="content-${numResults + 1}" class="same">${content}</div>
    <button class="upi-btn" id="upi-btn-${numResults + 1}" onclick="setVisibility_of_UPI(${numResults + 1},${passing})">Show UPI Id</button>
    <div id="display-upi-${numResults + 1}" class="same"></div>`;

  personResultContainer.appendChild(newPersonResult);
}


function calculateBill() {
  const personName = document.querySelectorAll('[ id^="userName-" ]');
  const personUPI = document.querySelectorAll('[ id^="userUPI-" ]');
  const resultDiv = document.getElementById('head');
  const resultGroup = document.getElementById('person-results');

  const names = Array.from(personName).map(input => input.value);
  const upiIds = Array.from(personUPI).map(input => input.value);
  // START: for selecting all persons and filtering corresponding amounts and convert corresponding amounts to a decimal value
  let person = document.querySelectorAll('[ id^="amount-" ]');
  const a = Array.from(person).map(i => Array.from(i.getElementsByClassName('userAmount')));
  const p = Array.from(person).map(i => Array.from(i.getElementsByClassName('userPurpose')));
  db = []
  const amounts = a.map((ele, i) => {
    obj = {
      keys: [],
      vals: [],
    };
    let aa = ele.map(input => parseFloat(input.value));
    let pp = p[i].map(input => "" + input.value);
    // console.log(pp);
    aa.map((e, index) => {
      obj.keys.push(pp[index]);
      obj.vals.push(e);
      obj.name = names[index];
      obj.upi = upiIds[index];
    });
    // console.log(obj);
    const v = aa.reduce((sum, amount) => sum + amount, 0);
    db.push(obj);
    return v;
  }
  );
  // console.log(db);

  //END......
  resultDiv.textContent = "";
  resultGroup.textContent = '';



  if (amounts.some(isNaN) || amounts.some(amount => amount < 0)) {
    resultDiv.textContent = 'Invalid input. Please enter valid amounts for each person.';
    return;
  }

  if (names.filter((element) => element === '').length > 0) {
    resultDiv.textContent = 'Empty Name Field! . Please enter person Name';
    return;
  }

  if (upiIds.filter((element) => element === '').length > 0) {
    resultDiv.textContent = 'Empty UPI ID Field! . Please enter person UPI ID';
    return;
  }
  if (amounts.length < 2) {
    resultDiv.textContent = 'Enter Atleast Two Enteries To Calculate';
    return;
  }


  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
  const numPeople = names.length;

  const perPersonAmount = totalAmount / numPeople;

  const payments = [];
  const balances = [];

  for (let i = 0; i < numPeople; i++) {
    balances.push(amounts[i] - perPersonAmount);
  }

  let payerIndex = 0;
  let receiverIndex = 1;

  //START: Main Logic for splitting bills
  let len = balances.filter(balance => balance != 0).length;
  while (len > 1) {

    while (balances[payerIndex] > 0 && balances[receiverIndex] == 0) {
      receiverIndex = (receiverIndex + 1) % numPeople;
    }

    if (payerIndex != receiverIndex && balances[payerIndex] > 0 && balances[receiverIndex] < 0) {
      const amount = Math.min(Math.abs(balances[payerIndex]), Math.abs(balances[receiverIndex]));
      payments.push({
        payer: payerIndex,
        receiver: receiverIndex,
        amount: amount.toFixed(3)
      });

      balances[payerIndex] -= amount;
      balances[receiverIndex] += amount;
    }

    payerIndex = (payerIndex + 1) % numPeople;
    receiverIndex = (receiverIndex + 1) % numPeople;
    len = balances.filter(balance => balance != 0).length;
  }
  //END.......

  let results = '';

  if (payments.length === 0) {
    results = 'No payments needed. Everyone paid an equal amount.';
    resultDiv.textContent = results;

  } else {
    resultDiv.textContent = "Who Has To Pay How Much ?";
    str = "\n";
    payments.forEach(payment => {
      results = `${names[payment.receiver]} has to pay Rs ${payment.amount} to ${names[payment.payer]}\n`;
      addPersonResult(results, upiIds[payment.payer]);
      str += results + '\n';

    });
  }
  saveButton.removeAttribute('hidden');
  if (uid != null) {
    serverButton.removeAttribute('hidden');
  }


  props = {

    outputType: jsPDFInvoiceTemplate.OutputType.Save,
    returnJsPDFDocObject: true,
    fileName: "Dues-Info",
    orientationLandscape: false,
    compress: true,
    logo: {
      src: "./image.png",
      width: 65, //aspect ratio = width/height
      height: 25,
      margin: {
        top: 0, //negative or positive num, from the current position
        left: 0 //negative or positive num, from the current position
      }
    },
    business: {
      name: "Easy Split",
      address: "Muzaffarpur Bihar",
      phone: "(+91) 8292625628",
      email: "ritikachoudhary8292@gmail.com",
      website: "easySplit.netlify.app",
    },
    contact: {
      label: "TRIP NAME: ",
      name: `${tripName}`,
      address: "\n",
      // phone: "(+355) 069 22 22 222",
      // email: "client@website.al",
      // otherInfo: "www.website.al",
    },
    invoice: {
      // label: "Invoice #: ",
      // num: 19,
      // invDate: "Payment Date: 01/01/2021 18:12",
      // invGenDate: "Invoice Date: 02/02/2021 10:17",
      headerBorder: true,
      tableBodyBorder: true,
      header: [
        {
          title: "S.No",
          style: {
            width: 20
          }
        },
        {
          title: "Name",
          style: {
            width: 70
          }
        },
        {
          title: "TotalAmount Paid",
          style: {
            width: 60
          }
        },
        {
          title: "UPI ID",
          style: {
            width: 40
          }
        }

      ],
      table: Array.from(Array(numPeople), (item, index) => ([
        index + 1,
        names[index],
        amounts[index],
        upiIds[index],
      ])),

      invDescLabel: "Summary: Who Has To Pay How Much ?",
      invDesc: `${str} \n `,
    },

    footer: {
      text: "The Pdf is created on a computer and is valid without the signature and stamp.",
    },
    pageEnable: true,
    pageLabel: "Page ",
  };
}

function saveToServer() {

  //adding this user to firebase database
  var database_ref = database.ref();

  //console.log(database_ref);
  db.forEach((ele, i) => {
    // console.log(ele);
    database_ref.child('users/' + uid + '/trips/' + tripName + '/' + i).set(ele);
  });

  alert('successfully saved!');

}

function setFields() {
  //fill the fields with store data on server
  var user_ref = database.ref('users/' + uid + '/trips');
  user_ref.on('value', (snap) => {
    var data = snap.val();
    data[tripName].forEach((ele, i) => {
      if (i != 0) {
        addPersonInput();
      }

      let name1 = document.getElementById(`userName-${i + 1}`);
      name1.defaultValue = ele.name;
      let upi1 = document.getElementById(`userUPI-${i + 1}`);
      upi1.defaultValue = ele.upi;

      ele.keys.forEach((element, index) => {
        if (index != 0) {
          addCol(i + 1);
        }
        let amountDiv = document.getElementById(`amount-${i + 1}`);
        let table = amountDiv.querySelector('table');
        var lastRow1col = table.rows[index + 1].cells[0];
        var lastRow2col = table.rows[index + 1].cells[1];
        lastRow1col.querySelector('input').defaultValue = element;
        lastRow2col.querySelector('input').defaultValue = ele.vals[index];

      })
    })
  })
}

function generatePdf() {
  var pdfObject = jsPDFInvoiceTemplate.default(props);
}

