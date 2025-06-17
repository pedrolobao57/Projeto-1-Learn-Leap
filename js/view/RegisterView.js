const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const finishBtns = document.querySelectorAll(".btn-finish");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;

nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum--;
    updateFormSteps();
    updateProgressbar();
  });
});

function updateFormSteps() {
  formSteps.forEach((formStep) => {
    formStep.classList.contains("form-step-active") &&
      formStep.classList.remove("form-step-active");
  });

  formSteps[formStepsNum].classList.add("form-step-active");
}

function updateProgressbar() {
  progressSteps.forEach((progressStep, idx) => {
    if (idx < formStepsNum + 1) {
      progressStep.classList.add("progress-step-active");
    } else {
      progressStep.classList.remove("progress-step-active");
    }
  });

  const progressActive = document.querySelectorAll(".progress-step-active");

  progress.style.width =
    ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}

// Dropdown functionality for the buttons
document.querySelectorAll('.dropdown-menu').forEach(menu => {
  menu.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', event => {
      const value = item.getAttribute('data-value');
      const button = menu.previousElementSibling;
      button.textContent = value;
    });
  });
});

const dropdownButton = document.getElementById('dropdownDays');
const checkboxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]');

function updateDayButtonLabel() {
  const checkedDays = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

  if (checkedDays.length === 0) {
    dropdownButton.textContent = 'Choose Days';
  } else if (checkedDays.length === 1) {
    dropdownButton.textContent = checkedDays[0];
  } else {
    dropdownButton.textContent = `${checkedDays.length} days selected`;
  }
}

// Update label when checkbox is clicked
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', updateDayButtonLabel);
});

// Also update when clicking anywhere in day-option
document.querySelectorAll('.day-option').forEach(item => {
  item.addEventListener('click', function (e) {
    e.stopPropagation();

    const checkbox = this.querySelector('input[type="checkbox"]');

    // Toggle only if the click wasn't directly on the checkbox
    if (e.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    }
  });
});

// Wave animation on scroll
let wave1 = document.getElementById("wave1");
let wave2 = document.getElementById("wave2");
let wave3 = document.getElementById("wave3");
let wave4 = document.getElementById("wave4");

window.addEventListener("scroll", function () {
  let value = window.scrollY;
  wave1.style.backgroundPositionX = 400 + value + "px";
  wave2.style.backgroundPositionX = 300 + value + "px";
  wave3.style.backgroundPositionX = 200 + value + "px";
  wave4.style.backgroundPositionX = 100 + value + "px";
});