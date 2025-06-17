let accountType = "teacher"; // Default if nothing in URL

function init() {
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get("type");
  if (typeParam === "teacher" || typeParam === "student") {
    accountType = typeParam;
  }

  setupDropdown("dropdownLocation", "locationInput");
  setupDropdown("dropdownMethod", "methodInput");
  setupDropdown("dropdownClasses", "classesInput");
  setupDropdown("dropdownSubjects", "subjectsInput");
}

function setupDropdown(buttonId, inputId) {
  const button = document.getElementById(buttonId);
  const input = document.getElementById(inputId);
  if (!button || !input) return; // safeguard

  const menu = button.nextElementSibling;

  menu.querySelectorAll("a.dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      input.value = item.getAttribute("data-value");
      button.textContent = item.textContent.trim();
    });
  });
}

function saveAccount() {
  // Get values inside function
  const name = document.getElementById("username").value;
  const dob = document.getElementById("dob").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subjectsInput").value;
  const classes = document.getElementById("classesInput").value;
  const method = document.getElementById("methodInput").value;
  const location = document.getElementById("locationInput").value;
  const price = document.getElementById("price").value;

  // Get checked days *inside* the function so it’s fresh
const dayCheckboxes = document.querySelectorAll(
  'input[type="checkbox"]:checked'
);
const days = Array.from(dayCheckboxes).map((cb) => cb.value);

  // Create account object with correct variable names
  const account = {
    type: accountType,
    name,
    dob,
    password,
    confirmPassword,
    email,
    subject,
    classes,
    method,
    location,
    price,
    days,
  };

  const key = `${accountType}Accounts`;
  const accounts = JSON.parse(localStorage.getItem(key)) || [];
  accounts.push(account);
  localStorage.setItem(key, JSON.stringify(accounts));

  alert("Account saved!"); // teste

}

window.addEventListener("DOMContentLoaded", init);

document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn");
  if (registerBtn) {
    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      saveAccount();
    });
  }
});