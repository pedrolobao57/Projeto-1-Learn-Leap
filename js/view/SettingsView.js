document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settingsForm");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    alert("No user logged in.");
    return;
  }

  // Preencher campos existentes
  document.getElementById("username").value = loggedInUser.name || "";
  document.getElementById("dob").value = loggedInUser.dob || "";
  document.getElementById("email").value = loggedInUser.email || "";

  document.getElementById("subjectInput").value = loggedInUser.subject || "";
  document.getElementById("classTypeInput").value = loggedInUser.classes || "";
  document.getElementById("levelInput").value = loggedInUser.level || "";
  document.getElementById("locationInput").value = loggedInUser.location || "";

  document.getElementById("subjectBtn").textContent = loggedInUser.subject || "Choose a Subject";
  document.getElementById("classTypeBtn").textContent = loggedInUser.classes || "Choose Class Type";
  document.getElementById("levelBtn").textContent = loggedInUser.level || "Choose Level";
  document.getElementById("dropdownLocationButton").textContent = loggedInUser.location || "Choose a Location";

  const maxPriceContainer = document.getElementById("maxPriceContainer");
  const priceContainer = document.getElementById("priceContainer");

  if (loggedInUser.type === "teacher") {
    priceContainer.style.display = "block";
    maxPriceContainer.style.display = "none";

    if (loggedInUser.price) {
      document.getElementById("price").value = loggedInUser.price;
    }
  } else if (loggedInUser.type === "student") {
    priceContainer.style.display = "none";
    maxPriceContainer.style.display = "block";

    if (loggedInUser.maxPrice) {
      document.getElementById("maxPrice").value = loggedInUser.maxPrice;
    }
  }

  if (Array.isArray(loggedInUser.days)) {
    loggedInUser.days.forEach(day => {
      const checkbox = document.getElementById(`day${day}`);
      if (checkbox) checkbox.checked = true;
    });
  }

  // Dropdowns setup function
  function setupDropdown(buttonId, menuId, inputId) {
    const button = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);
    const input = document.getElementById(inputId);

    button.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });

    menu.querySelectorAll("li").forEach(item => {
      item.addEventListener("click", () => {
        const value = item.getAttribute("data-value");
        button.textContent = value;
        input.value = value;
        menu.classList.add("hidden");
      });
    });
  }

  setupDropdown("subjectBtn", "subjectMenu", "subjectInput");
  setupDropdown("classTypeBtn", "classTypeMenu", "classTypeInput");
  setupDropdown("levelBtn", "levelMenu", "levelInput");

  const locationBtn = document.getElementById("dropdownLocationButton");
  const locationMenu = document.getElementById("locationDropdown");
  const locationInput = document.getElementById("locationInput");

  locationBtn.addEventListener("click", () => {
    locationMenu.classList.toggle("hidden");
  });

  locationMenu.querySelectorAll("a").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      const value = item.getAttribute("data-value");
      locationBtn.textContent = value;
      locationInput.value = value;
      locationMenu.classList.add("hidden");
    });
  });

  


  // Submit do formulário
  form.addEventListener("submit", e => {
    e.preventDefault();

    const selectedDays = [];
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].forEach(day => {
      const checkbox = document.getElementById(`day${day}`);
      if (checkbox && checkbox.checked) {
        selectedDays.push(day);
      }
    });

    const updatedUser = {
      ...loggedInUser,
      name: document.getElementById("username").value,
      dob: document.getElementById("dob").value,
      subject: document.getElementById("subjectInput").value,
      classes: document.getElementById("classTypeInput").value,
      level: document.getElementById("levelInput").value,
      location: document.getElementById("locationInput").value,
      days: selectedDays
    };

    if (loggedInUser.type === "teacher") {
      updatedUser.price = document.getElementById("price").value;
    } else if (loggedInUser.type === "student") {
      updatedUser.maxPrice = document.getElementById("maxPrice").value;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    showAlert("Settings saved successfully!", false); // false = alerta verde
  });
});

function showAlert(message, isError = false) {
  const alertBox = document.getElementById("customAlert");
  const alertMessage = document.getElementById("customAlertMessage");
  const closeBtn = document.getElementById("customAlertClose");

  alertMessage.textContent = message;
  alertMessage.style.color = isError ? "red" : "green";

  alertBox.classList.remove("hidden");

  closeBtn.onclick = () => {
    alertBox.classList.add("hidden");
  };
}
