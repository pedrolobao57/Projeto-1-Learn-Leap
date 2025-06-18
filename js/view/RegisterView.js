export default class RegisterView {
  constructor(accountType) {
    this.accountType = accountType;
    this.currentStep = 0;
    this.formSteps = document.querySelectorAll(".form-step");
    this.progressSteps = document.querySelectorAll(".progress-step");

    this.nextBtns = document.querySelectorAll(".btn-next");
    this.prevBtns = document.querySelectorAll(".btn-prev");
    this.registerBtn = document.getElementById("registerBtn");

    this.setupEventListeners();
    this.setupDropdowns();
    this.updateDaysSelected();
    this.updateDaysButtonLabel();

    this.setupFormView();
  }

  // hides the form steps and shows the current step
  updateFormSteps() {
    this.formSteps.forEach((formStep) => {
      formStep.classList.remove("form-step-active");
    });

    this.formSteps[this.currentStep].classList.add("form-step-active");
  }

  // updates the progress bar based on the current step and makes sure the width is set correctly
  updateProgressbar() {
    this.progressSteps.forEach((progressStep, idx) => {
      if (idx <= this.currentStep) {
        progressStep.classList.add("progress-step-active");
      } else {
        progressStep.classList.remove("progress-step-active");
      }
    });

    const progress = document.getElementById("progress");
    const activeSteps = Array.from(this.progressSteps).filter((step) =>
      step.classList.contains("progress-step-active")
    );

    if (progress && this.progressSteps.length > 1) {
      progress.style.width =
        ((activeSteps.length - 1) / (this.progressSteps.length - 1)) * 100 +
        "%";
    }
  }
  setupEventListeners() {
    // Next button for step navigation
    this.nextBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        const currentStepEl = this.formSteps[this.currentStep];
        const requiredInputs = currentStepEl.querySelectorAll(
          "input, select, textarea"
        );

        let allFilled = true;

        requiredInputs.forEach((input) => {
          if (
            input.type !== "checkbox" &&
            input.type !== "radio" &&
            input.hasAttribute("required") &&
            !input.value.trim()
          ) {
            allFilled = false;
            input.classList.add("is-invalid");
          } else {
            input.classList.remove("is-invalid");
          }
        });

        // Check if password match
        if (this.currentStep === 0) {
          const password = document.getElementById("password")?.value;
          const confirmPassword =
            document.getElementById("confirmPassword")?.value;

          if (password !== confirmPassword) {
            this.showAlert("Passwords do not match.");
            return;
          }
        }

        if (allFilled) {
          this.changeStep(this.currentStep + 1);
        } else {
          this.showAlert(
            "Please fill in all required fields before continuing."
          );
        }
      });
    });

    // Previous button for step navigation
    this.prevBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.changeStep(this.currentStep - 1);
      });
    });

    // Make sure the days checkboxes update the selected days
    document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        this.updateDaysSelected();
        this.updateDaysButtonLabel();
      });
    });
  }
  // Update the current step and progress bar
  changeStep(step) {
    if (step < 0 || step >= this.formSteps.length) return;

    this.currentStep = step;
    this.updateFormSteps();
    this.updateProgressbar();
  }

  // Makes the data value of the dropdowns the text content of the button
  setupDropdowns() {
    const dropdowns = [
      ["dropdownLocation", "locationInput"],
      ["dropdownLevel", "levelInput"],
      ["dropdownClasses", "classesInput"],
      ["dropdownSubjects", "subjectsInput"],
    ];

    dropdowns.forEach(([buttonId, inputId]) => {
      const button = document.getElementById(buttonId);
      const input = document.getElementById(inputId);
      if (!button || !input) return;

      const menu = button.nextElementSibling;

      menu.querySelectorAll("a.dropdown-item").forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          input.value = item.getAttribute("data-value");
          button.textContent = item.textContent.trim();
        });
      });
    });
  }

  // Updates the button text for the days dropdown based on selected checkboxes
  updateDaysButtonLabel() {
    const dropdownButton = document.getElementById("dropdownDays");
    const checkboxes = document.querySelectorAll(
      '.dropdown-menu input[type="checkbox"]'
    );
    const checkedDays = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    if (checkedDays.length === 0) {
      dropdownButton.textContent = "Choose Days";
    } else if (checkedDays.length === 1) {
      dropdownButton.textContent = checkedDays[0];
    } else {
      dropdownButton.textContent = `${checkedDays.length} days selected`;
    }
  }

  // Makes sure the selected days are stored
  updateDaysSelected() {
    const checkedDays = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((cb) => cb.value);
    const hiddenInput = document.getElementById("daysSelected");
    if (hiddenInput) hiddenInput.value = checkedDays.join(",");
  }

  // This function hides the price group for student accounts
  setupFormView() {
    const priceGroup = document.getElementById("priceGroup");
    const maxPriceGroup = document.getElementById("maxPriceGroup");
    const priceInput = document.getElementById("price");
    const maxPriceInput = document.getElementById("maxPrice");

    if (this.accountType === "student") {
      // Show only max price for students
      if (priceGroup) priceGroup.style.display = "none";
      if (maxPriceGroup) maxPriceGroup.style.display = "block";

      if (priceInput) {
        priceInput.removeAttribute("required");
        priceInput.disabled = true; // ✅ disable unused input
      }
      if (maxPriceInput) {
        maxPriceInput.setAttribute("required", "true");
        maxPriceInput.disabled = false;
      }
    } else {
      // Show only teacher price
      if (priceGroup) priceGroup.style.display = "block";
      if (maxPriceGroup) maxPriceGroup.style.display = "none";

      if (priceInput) {
        priceInput.setAttribute("required", "true");
        priceInput.disabled = false;
      }
      if (maxPriceInput) {
        maxPriceInput.removeAttribute("required");
        maxPriceInput.disabled = true; // ✅ disable unused input
      }
    }
  }

  // Custom alert box
  showAlert(message, isError = true) {
    const alertBox = document.getElementById("customAlert");
    const alertMessage = document.getElementById("customAlertMessage");
    alertMessage.textContent = message;
    alertBox.classList.remove("hidden");
    alertBox.style.color = isError ? "red" : "green";

    const closeBtn = document.getElementById("customAlertClose");
    closeBtn.onclick = () => alertBox.classList.add("hidden");
  }
}
