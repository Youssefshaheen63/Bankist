'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements

const movementsContainer = document.querySelector('.movements');
const labelBalance = document.querySelector('.balance--value');
const incomes = document.querySelector('.summary--value--in');
const outs = document.querySelector('.summary--value--out');
const interests = document.querySelector('.summary--value--interest');
const appContainer = document.querySelector('.app');
const labelWelcome = document.querySelector('.welcome');


const closeBtn = document.querySelector('.close-btn');
const loginBtn = document.querySelector('.login__btn');
const transferBtn = document.querySelector('.trans-btn');
const requestBtn = document.querySelector('.request-btn');
const sortBtn = document.querySelector('.btn--sort');

const loginUser = document.querySelector('.login--user');
const loginPin = document.querySelector('.login--pin');
const transferTo = document.querySelector('.transfer-to');
const transferValue = document.querySelector('.transfer-value');
const closeUser = document.querySelector('.close-user');
const pinUser = document.querySelector('.close-pin');
const loanAmount = document.querySelector('.loan--amount');

// Display Movements
const displayMovements = function (movements, sort = false) {
  movementsContainer.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movement--row ">
                    <div class="movement-type ${type}">${i + 1} ${type}</div>
                      <div class="movement--details">
                        <div class="movement-value">${mov}€</div>
                        <div class="movement-date"><span>IN :</span> 16/07/2024</div>
                      </div>
                  </div>`;

    // console.log(html);
    movementsContainer.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate Balance
const calcBalance = function (acc) {
  const balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
};

const displaySummry = function (account) {
  const movement = account.movements;
  const incomeing = movement
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  incomes.textContent = ` ${incomeing}€`;

  const out = movement
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  outs.textContent = ` ${Math.abs(out)}€`;

  const interest = movement
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  interests.textContent = `${interest}€`;
};

// Compute UserName
const computingUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

computingUserName(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display Balance
  calcBalance(acc);

  // Display summry
  displaySummry(acc);
};

// Event Handlers

// Login
let currentUser;
loginBtn.addEventListener('click', function (e) {
  e.preventDefault();

  currentUser = accounts.find(acc => acc.userName === loginUser.value);

  if (currentUser?.pin === Number(loginPin.value)) {
    //  Display UI
    labelWelcome.textContent = `Welcome ${currentUser.owner.split(' ')[0]}`;
    appContainer.style.opacity = 1;

    // Clear input Fields
    loginUser.value = loginPin.value = '';

    // BLur Method Make Field loses Fovus
    loginPin.blur();

    updateUI(currentUser);
  }
});

// Request Loan
requestBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(loanAmount.value);

  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    updateUI(currentUser);
  }
  // Clear input Fields
  loanAmount.value = '';
  loanAmount.blur();
});

// Transfer Operation

transferBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = Number(transferValue.value);
  const receiverAccount = accounts.find(
    acc => acc.userName === transferTo.value
  );

  if (
    transferAmount <= currentUser.balance &&
    transferAmount > 0 &&
    receiverAccount &&
    currentUser.userName !== receiverAccount.userName
  ) {
    currentUser.movements.push(-transferAmount);
    receiverAccount.movements.push(transferAmount);
    updateUI(currentUser);
  }
  // Clear input Fields
  transferValue.value = transferTo.value = '';
  transferValue.blur();
});

closeBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const userConfirm = closeUser.value;
  const pinConfirm = Number(pinUser.value);
  if (userConfirm === currentUser.userName && pinConfirm === currentUser.pin) {
    const index = accounts.findIndex(acc => acc.userName === userConfirm);

    accounts.splice(index, 1);
    // Hide UI
    appContainer.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  // Clear input Fields
  closeUser.value = pinUser.value = '';
  pinUser.blur();
});

let sort = !true;
sortBtn.addEventListener('click', function (e) {
  e.preventDefault();
  sort = sort ? false : true;
  displayMovements(currentUser.movements, sort);
});