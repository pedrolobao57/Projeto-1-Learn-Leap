import RegisterView from "/js/view/RegisterView.js";
import UserModel from "/js/model/UserModel.js";

let accountType = "teacher"; // default

function init() {
  setupWaveScrollEffect();

  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get("type");
  if (typeParam === "teacher" || typeParam === "student") {
    accountType = typeParam;
  }

  const view = new RegisterView(accountType);
  const model = new UserModel(accountType);

  // Register button click handler
  if (view.registerBtn) {
    view.registerBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Gather data from inputs
      const name = document.getElementById("username").value.trim();
      const dob = document.getElementById("dob").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subjectsInput").value;
      const classes = document.getElementById("classesInput").value;
      const level = document.getElementById("levelInput").value;
      const location = document.getElementById("locationInput").value;
      const price = document.getElementById("price").value.trim();
      const maxPrice = document.getElementById("maxPrice").value.trim();

      // Checked days from checkboxes
      const dayCheckboxes = document.querySelectorAll(
        'input[type="checkbox"]:checked'
      );
      const days = Array.from(dayCheckboxes).map((cb) => cb.value);

      // Validate required fields quickly
      if (accountType === "teacher") {
        if (
          !name ||
          !dob ||
          !password ||
          !confirmPassword ||
          !email ||
          !subject ||
          !classes ||
          !level ||
          !location ||
          !price ||
          days.length === 0
        ) {
          view.showAlert("Please fill in all required fields.");
          return;
        }
      } else if (accountType === "student") {
        if (
          !name ||
          !dob ||
          !password ||
          !confirmPassword ||
          !email ||
          !subject ||
          !classes ||
          !level ||
          !location ||
          !maxPrice 
        ) {
          view.showAlert("Please fill in all required fields.");
          return;
        }
      }

      const account = {
        type: accountType,
        name,
        dob,
        password,
        confirmPassword,
        email,
        subject,
        classes,
        level,
        location,
        price,
        maxPrice,
        days,
      };

        try {
    model.saveAccount(account);
    view.showAlert("Registration successful!", false);

    // Auto-login & redirect after short delay
    setTimeout(() => {
      // Save user to localStorage as logged in
      localStorage.setItem("loggedInUser", JSON.stringify(account));

      // Redirect based on account type
      if (account.type === "teacher") {
        window.location.href = "/html/teacherHome.html"; 
      } else if (account.type === "student") {
        window.location.href = "/html/studentHome.html"; 
      }
    }, 1500); // delay so user sees the alert first

  } catch (err) {
    view.showAlert(err.message);
  }
    });
  }

  // Login form submit handler
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      const user = model.login(email, password);
      const messageDiv = document.getElementById("loginMessage");

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        messageDiv.style.color = "green";
        messageDiv.textContent = `Welcome back, ${user.name}!`;
      } else {
        messageDiv.style.color = "red";
        messageDiv.textContent = "Invalid email or password.";
      }
    });
  }
}

function setupWaveScrollEffect() {
  const wave1 = document.getElementById("wave1");
  const wave2 = document.getElementById("wave2");
  const wave3 = document.getElementById("wave3");
  const wave4 = document.getElementById("wave4");

  if (!wave1 || !wave2 || !wave3 || !wave4) return; // safety check

  window.addEventListener("scroll", () => {
    const value = window.scrollY;
    wave1.style.backgroundPositionX = 400 + value + "px";
    wave2.style.backgroundPositionX = 300 + value + "px";
    wave3.style.backgroundPositionX = 200 + value + "px";
    wave4.style.backgroundPositionX = 100 + value + "px";
  });
}

window.addEventListener("DOMContentLoaded", init);
