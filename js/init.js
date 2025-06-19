import RegisterView from "/js/view/RegisterView.js";
import UserModel from "/js/model/UserModel.js";

let accountType = "teacher"; // default

function generateRandomTeachers(num = 40) {
  const subjects = ["Maths", "Science", "English", "Portuguese"];
  const classesTypes = ["In Person", "Online", "Both"];
  const levels = ["Primary School", "Basic", "High School", "University"];
  const locations = [
    "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora",
    "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém",
    "Setúbal", "Viana do Castelo", "Vila Real", "Viseu"
  ];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomName() {
    const firstNames = [ "Alex", "Maria", "John", "Sofia", "Carlos", "Ana", "Luis", "Isabel",
    "João", "Inês", "Miguel", "Helena", "Pedro", "Clara", "Ricardo",
    "Beatriz", "Duarte", "Marta", "Tiago", "Carla", "Rui", "Sandra",
    "Nuno", "Patrícia", "Fábio"];
    const lastNames = ["Silva", "Costa", "Martins", "Ferreira", "Santos", "Pereira",
    "Oliveira", "Gomes", "Ribeiro", "Alves", "Carvalho", "Rodrigues",
    "Martins", "Lopes", "Soares", "Fernandes", "Barbosa", "Moura",
    "Pinto", "Dias", "Sousa", "Neves", "Correia", "Mendes", "Cruz"];
    return randomChoice(firstNames) + " " + randomChoice(lastNames);
  }

  function randomDOB() {
    const start = new Date(1970, 0, 1).getTime();
    const end = new Date(2000, 11, 31).getTime();
    const dob = new Date(start + Math.random() * (end - start));
    return dob.toISOString().split("T")[0];
  }

  function randomEmail(name) {
    return (
      name.toLowerCase().replace(" ", ".") +
      Math.floor(Math.random() * 100) +
      "@example.com"
    );
  }

  function randomPassword() {
    return "Pass" + Math.floor(Math.random() * 10000);
  }

  function randomPrice() {
    // Multiples of 5 between 10 and 45
    const multiples = [10, 15, 20, 25, 30, 35, 40, 45];
    return randomChoice(multiples);
  }

  const teachers = [];

  for (let i = 0; i < num; i++) {
    const name = randomName();
    const teacher = {
      type: "teacher",
      name,
      dob: randomDOB(),
      password: randomPassword(),
      confirmPassword: "same-as-password",
      email: randomEmail(name),
      subject: randomChoice(subjects),
      classes: randomChoice(classesTypes),
      level: randomChoice(levels),
      location: randomChoice(locations),
      price: randomPrice(),
      days: daysOfWeek.filter(() => Math.random() > 0.5),
    };
    if (teacher.days.length === 0) {
      teacher.days.push(randomChoice(daysOfWeek));
    }
    teachers.push(teacher);
  }

  return teachers;
}

function init() {
  setupWaveScrollEffect();

  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get("type");
  if (typeParam === "teacher" || typeParam === "student") {
    accountType = typeParam;
  }

  const view = new RegisterView(accountType);
  const model = new UserModel(accountType);

  // Generate and log 40 random teacher accounts JSON
  if (accountType === "teacher") {
    const teachersData = generateRandomTeachers(40);
    console.log("Generated Teachers JSON:", JSON.stringify(teachersData, null, 2));
  }

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
      const dayCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
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
        // Validate price multiples of 5 or 10
        const priceNumber = Number(price);
        if (isNaN(priceNumber) || priceNumber <= 0) {
          view.showAlert("Price must be a positive number");
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
        days,
      };

      if (accountType === "teacher") {
        account.price = Number(price);
      } else if (accountType === "student") {
        account.maxPrice = Number(maxPrice);
      }

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
            window.location.href = "/html/swipes.html"; 
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