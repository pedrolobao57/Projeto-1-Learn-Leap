function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // Add leading zero
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  const timeString = `${hours}:${minutes}`;
  document.getElementById("clock").textContent = timeString;
}

// Update every second
setInterval(updateClock, 1000);
updateClock(); // Initial call

// Display full date
const dateEl = document.getElementById("date-display");
const today = new Date();
dateEl.textContent = today.toDateString();

// Insert days dynamically
const grid = document.querySelector(".calendar-grid");
const monthEl = document.getElementById("calendarMonth");
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function renderCalendar(month, year) {
  // Clear previous days
  grid.querySelectorAll(".day").forEach(el => el.remove());

  // First day of the month
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjust for Monday as first day (1-based)
  let startOffset = (firstDay + 6) % 7;

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.textContent = d;
    cell.classList.add("day");

    if (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    grid.appendChild(cell);
  }

  monthEl.textContent = `${months[month]} ${year}`;
}

// Month navigation
document.getElementById("prevMonth").onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
};

document.getElementById("nextMonth").onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
};

// Init
renderCalendar(currentMonth, currentYear);

// Profile picture menu

document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("avatar");
  const rightPanel = document.getElementById("rightPanel");

  avatar.addEventListener("click", () => {
    rightPanel.innerHTML = `
      <div class="menu-panel">
        <h2>Hello, Nome</h2>
        <ul>
          <li>Settings</li>
          <li>Change Account</li>
          <li>Log Out</li>
        </ul>
        <img src="https://via.placeholder.com/200x120?text=Thank+You+Teacher" alt="Thank You Image" />
      </div>
    `;
  });
});