import { BookSessionModel } from "./model/BookSessionModel.js";
import { BookSessionView } from "./view/BookSessionView.js";
import RegisterView from "/js/view/RegisterView.js";
import UserModel from "/js/model/UserModel.js";

document.addEventListener("DOMContentLoaded", () => {
  setupWaveScrollEffect();

  // Booking page
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
        BookSessionModel.clearSelectedTeacher();
        console.log("Lesson booked successfully for teacher:", teacher.name);
      } else {
        console.error("Booking failed due to invalid teacher or data.");
      }
    });

    return;
  }

  // Registration page
  let accountType = "teacher";

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

  // Login page
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

    return;
  }

  // Home page session display
  updateUpcomingSessions();
  updateNextSession();
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

// Atualiza lista de sessões agendadas na sidebar/home
function updateUpcomingSessions() {
  const container = document.querySelector(".sessions");
  if (!container) return;

  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  container.innerHTML = "";

  if (bookings.length === 0) {
    container.innerHTML = "<p class='text-gray-500'>No upcoming sessions.</p>";
    return;
  }

  bookings.forEach(({ teacher, formData, bookedAt }) => {
    const session = document.createElement("div");
    session.className = "p-10 bg-white rounded-lg border-white mb-20";

    session.innerHTML = `
      <h3 class="text-lg font-semibold text-blue-600">${teacher.name}</h3>
      <p class="text-sm text-gray-700">📚 <strong>${teacher.subject}</strong> • 💶 €${teacher.price}</p>
      <p class="text-sm text-gray-700">🗓️ ${formData.day} at ${formData.time}</p>
      ${formData.notes ? `<p class="text-sm text-gray-600 italic">"${formData.notes}"</p>` : ""}
      <p class="text-xs text-gray-400 mt-1">Booked on ${new Date(bookedAt).toLocaleString()}</p>
    `;

    container.appendChild(session);
  });
}

// Função para mostrar a próxima sessão — DECLARADA GLOBALMENTE
function updateNextSession() {
  const container = document.querySelector(".nextsession-card");
  if (!container) return;

  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

  if (bookings.length === 0) {
    container.innerHTML = "<p class='text-gray-500'>No upcoming session.</p>";
    return;
  }

  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const now = new Date();
  const upcoming = bookings
    .map(({ teacher, formData, bookedAt }) => {
      const dayNum = dayMap[formData.day];
      if (dayNum === undefined) return null;

      const sessionDate = new Date();
      const currentDay = sessionDate.getDay();
      const daysUntil = (dayNum - currentDay + 7) % 7;
      sessionDate.setDate(sessionDate.getDate() + daysUntil);

      const [hour, minute] = formData.time.split(":").map(Number);
      sessionDate.setHours(hour, minute, 0, 0);

      return {
        teacher,
        formData,
        bookedAt,
        sessionDate,
      };
    })
    .filter(b => b) // remove nulls
    .filter(b => b.sessionDate > now) // future only
    .sort((a, b) => a.sessionDate - b.sessionDate);

  if (upcoming.length === 0) {
    container.innerHTML = "<p class='text-gray-500'>No upcoming session.</p>";
    return;
  }

  const next = upcoming[0];

  container.innerHTML = `
    <div class="p-4 bg-white rounded-lg border border-white">
      <h3 class="text-lg font-semibold text-green-600">${next.teacher.name}</h3>
      <p class="text-sm text-gray-700">📚 ${next.teacher.subject} • 💶 €${next.teacher.price}</p>
      <p class="text-sm text-gray-700">🗓️ ${next.formData.day} at ${next.formData.time}</p>
      ${next.formData.notes ? `<p class="text-sm italic text-gray-600">"${next.formData.notes}"</p>` : ""}
      <p class="text-xs text-gray-400 mt-1">Scheduled for ${next.sessionDate.toLocaleString()}</p>
    </div>
  `;
}
// Vincula a função globalmente para debugar se precisar
window.updateNextSession = updateNextSession;
