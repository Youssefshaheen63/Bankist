'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2024-07-11T17:01:17.194Z',
    '2024-07-15T23:36:17.929Z',
    '2024-07-25T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2023-12-01T13:15:33.035Z',
    '2023-12-25T09:48:16.867Z',
    '2024-01-01T06:04:23.907Z',
    '2024-01-15T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-05-01T14:43:26.374Z',
    '2024-06-05T18:49:59.371Z',
    '2024-07-10T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2023-11-22T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-07-02T09:15:04.904Z',
    '2024-07-26T10:17:24.185Z',
    '2024-07-27T14:11:59.604Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
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
const labelDate = document.querySelector('.date');
const labelTime = document.querySelector('.balance--time');

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

const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
};

// Calc Date
const formatDays = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  if (daysPassed === 0) {
    return `Today`;
  } else if (daysPassed === 1) {
    return `Yesterday`;
  } else if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  } else {
    return new Intl.DateTimeFormat(locale, options).format(date);
  }
};


const formatedCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
// Display Movements
const displayMovements = function (acc, sort = false) {
  movementsContainer.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDays(date, acc.locale);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const formatedMov = formatedCur(mov, acc.locale, acc.currency);
    const html = `<div class="movement--row ">
                    <div class="movement-type ${type}">${i + 1} ${type}</div>
                      <div class="movement--details">
                        <div class="movement-value">${formatedMov}</div>
                        <div class="movement-date"><span>IN :</span> ${displayDate}</div>
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
  const formatedBalance = formatedCur(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formatedBalance}`;
};

const displaySummry = function (account) {
  const movement = account.movements;
  const incomeing = movement
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const formatedIn = formatedCur(incomeing, account.locale, account.currency);
  incomes.textContent = ` ${formatedIn}`;

  const out = movement
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formatedOut = formatedCur(out, account.locale, account.currency);
  outs.textContent = ` ${formatedOut}`;

  const interest = movement
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  const formatedInterest = formatedCur(
    interest,
    account.locale,
    account.currency
  );
  interests.textContent = `${formatedInterest}`;
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
  displayMovements(acc);

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

    // Current Date
    // Adding Dates
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}-${month}-${year}`;
    // labelTime.textContent = `${hour}:${min}`;

    const locale = currentUser.locale;
    const now = new Date();

    const date = new Intl.DateTimeFormat(locale, options).format(now);
    labelDate.textContent = date;

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
  const amount = Math.floor(loanAmount.value);

  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    currentUser.movementsDates.push(new Date().toISOString());
    updateUI(currentUser);
  }
  // Clear input Fields
  loanAmount.value = '';
  loanAmount.blur();
});

// Transfer Operation

transferBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = +transferValue.value;
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
    currentUser.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentUser);
  }
  // Clear input Fields
  transferValue.value = transferTo.value = '';
  transferValue.blur();
});

closeBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const userConfirm = closeUser.value;
  const pinConfirm = +pinUser.value;
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
  displayMovements(currentUser, sort);
});


