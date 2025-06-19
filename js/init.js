import { BookSessionModel } from "./model/BookSessionModel.js";
import { BookSessionView } from "./view/BookSessionView.js";
import RegisterView from '/js/view/RegisterView.js';
import  UserModel  from  "/js/model/UserModel.js";

document.addEventListener("DOMContentLoaded", () => {
  setupWaveScrollEffect();

  if (document.getElementById("bookingForm")) {
    const teacher = BookSessionModel.getSelectedTeacher();
    console.log("Loaded selected teacher:", teacher);

    if (!teacher) {
      BookSessionView.showNoTeacher();
      return;
    }

    BookSessionView.renderTeacherInfo(teacher);

    BookSessionView.onSubmit((formData) => {
      const success = BookSessionModel.bookLesson(teacher, formData);
      if (success) {
        // Clear selectedTeacher so user must select again next time
        BookSessionModel.clearSelectedTeacher();
        console.log("Lesson booked successfully for teacher:", teacher.name);
      } else {
        console.error("Booking failed due to invalid teacher or data.");
      }
    });

    return;
  }

  let accountType = "teacher"; // default

  const registerBtn = document.getElementById("registerBtn");
  if (registerBtn) {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get("type");
    if (typeParam === "teacher" || typeParam === "student") {
      accountType = typeParam;
    }

    const view = new RegisterView(accountType);
    const model = new UserModel(accountType);

    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const name = document.getElementById("username").value.trim();
      const dob = document.getElementById("dob").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subjectsInput").value;
      const classes = document.getElementById("classesInput").value;
      const level = document.getElementById("levelInput").value;
      const location = document.getElementById("locationInput").value;
      const price = document.getElementById("price")?.value.trim();
      const maxPrice = document.getElementById("maxPrice")?.value.trim();

      const dayCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
      const days = Array.from(dayCheckboxes).map((cb) => cb.value);

      if (accountType === "teacher") {
        if (!name || !dob || !password || !confirmPassword || !email || !subject || !classes || !level || !location || !price || days.length === 0) {
          view.showAlert("Please fill in all required fields.");
          return;
        }
        const priceNumber = Number(price);
        if (isNaN(priceNumber) || priceNumber <= 0) {
          view.showAlert("Price must be a positive number");
          return;
        }
      } else {
        if (!name || !dob || !password || !confirmPassword || !email || !subject || !classes || !level || !location || !maxPrice) {
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
        days,
      };

      if (accountType === "teacher") {
        account.price = Number(price);
      } else {
        account.maxPrice = Number(maxPrice);
      }

      try {
        model.saveAccount(account);
        view.showAlert("Registration successful!", false);

        setTimeout(() => {
          localStorage.setItem("loggedInUser", JSON.stringify(account));
          window.location.href = account.type === "teacher"
            ? "/html/teacherHome.html"
            : "/html/swipes.html";
        }, 1500);
      } catch (err) {
        view.showAlert(err.message);
      }
    });

    return;
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const model = new UserModel(accountType);

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
});

function setupWaveScrollEffect() {
  const wave1 = document.getElementById("wave1");
  const wave2 = document.getElementById("wave2");
  const wave3 = document.getElementById("wave3");
  const wave4 = document.getElementById("wave4");

  if (!wave1 || !wave2 || !wave3 || !wave4) return;

  window.addEventListener("scroll", () => {
    const value = window.scrollY;
    wave1.style.backgroundPositionX = 400 + value + "px";
    wave2.style.backgroundPositionX = 300 + value + "px";
    wave3.style.backgroundPositionX = 200 + value + "px";
    wave4.style.backgroundPositionX = 100 + value + "px";
  });
}