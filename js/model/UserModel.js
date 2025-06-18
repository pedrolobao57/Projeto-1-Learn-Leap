export default class UserModel {
  constructor(accountType = 'teacher') {
    this.accountType = accountType;
  }

  setAccountType(type) {
    if (type === 'teacher' || type === 'student') {
      this.accountType = type;
    }
  }

  saveAccount(account) {
    const key = `${this.accountType}Accounts`;
    const accounts = JSON.parse(localStorage.getItem(key)) || [];
    accounts.push(account);
    localStorage.setItem(key, JSON.stringify(accounts));
  }

  login(email, password) {
    const teacherAccounts = JSON.parse(localStorage.getItem('teacherAccounts')) || [];
    const studentAccounts = JSON.parse(localStorage.getItem('studentAccounts')) || [];
    const allAccounts = [...teacherAccounts, ...studentAccounts];

    return allAccounts.find(acc => acc.email === email && acc.password === password);
  }
}