// Clock
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("clock").textContent = `${hours}:${minutes}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Date
  const dateEl = document.getElementById("date-display");
  const today = new Date();
  dateEl.textContent = today.toDateString();

  // Calendar
  const grid = document.querySelector(".calendar-grid");
  const monthEl = document.getElementById("calendarMonth");
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  function renderCalendar(month, year) {
    grid.querySelectorAll(".day").forEach((el) => el.remove());
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let startOffset = (firstDay + 6) % 7;

    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement("div");
      grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement("div");
      cell.textContent = d;
      cell.classList.add("day");
      if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        cell.classList.add("today");
      }
      grid.appendChild(cell);
    }
    monthEl.textContent = `${months[month]} ${year}`;
  }

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

  renderCalendar(currentMonth, currentYear);

  // Section Switching
  function showSection(sectionId) {
    const sections = document.querySelectorAll(".content-section");
    sections.forEach((section) => {
      section.style.display = "none";
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
      activeSection.style.display = "block";

      if (sectionId === "profile") {
        renderLikedTeachers(); // Load teachers dynamically
      }
    }
  }

  // Avatar toggle
  const avatarButton = document.getElementById("avatarButton");
  const sidebarMenu = document.getElementById("sidebarMenu");

  avatarButton.addEventListener("click", () => {
    sidebarMenu.style.display =
      sidebarMenu.style.display === "block" ? "none" : "block";
  });

  window.addEventListener("click", function (e) {
    if (!avatarButton.contains(e.target) && !sidebarMenu.contains(e.target)) {
      sidebarMenu.style.display = "none";
    }
  });

  // Liked Teachers Dynamic Rendering
  function renderLikedTeachers() {
    const likedTeachers = JSON.parse(localStorage.getItem("likedTeachers")) || [];
    const container = document.getElementById("likedTeachersProfile");
    container.innerHTML = "";

    if (likedTeachers.length === 0) {
      container.innerHTML = "<p class='text-center text-gray-500 col-span-3'>No liked teachers found.</p>";
      return;
    }

    likedTeachers.forEach(teacher => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded-xl shadow border border-blue-200 flex flex-col justify-between";
      card.innerHTML = `
        <div>
          <div class="flex items-center gap-4">
            <img src="/img/pfp.jpg" class="w-16 h-16 rounded-full object-cover" alt="Teacher Profile" />
            <div>
              <h2 class="text-xl font-bold text-blue-600">${teacher.name}</h2>
              <p class="text-sm text-gray-600">${teacher.subject} • ${teacher.level}</p>
            </div>
          </div>
          <ul class="mt-4 text-sm text-gray-700 space-y-1">
            <li><i class="fa-solid fa-coins text-blue-500 mr-2"></i>€${teacher.price}</li>
            <li><i class="fa-solid fa-map-marker-alt text-blue-500 mr-2"></i>${teacher.location}</li>
            <li><i class="fa-solid fa-star text-yellow-400 mr-2"></i>${teacher.rating}/5</li>
            <li><i class="fa-solid fa-clock text-blue-500 mr-2"></i>${teacher.days.join(", ")}</li>
            <li><i class="fa-solid fa-user-graduate text-blue-500 mr-2"></i>${teacher.classType}</li>
            <li><i class="fa-solid fa-info-circle text-blue-500 mr-2"></i>${teacher.description}</li>
          </ul>
        </div>
        <div class="mt-4 flex gap-2">
          <button class="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center gap-2">
            <img src="https://img.icons8.com/?size=100&id=59753&format=png&color=ffffff" class="w-5 h-5" alt="Chat"> Text
          </button>
          <button class="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center gap-2">
            <img src="https://img.icons8.com/?size=100&id=238Ts6gRDGws&format=png&color=ffffff" class="w-5 h-5" alt="Call"> Call
          </button>
          <button class="book-now-btn flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center gap-2">Book Now</button>
        </div>
      `;
      container.appendChild(card);
    });
  }

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("book-now-btn")) {
    const card = e.target.closest(".bg-white");
    const teacherName = card.querySelector("h2").textContent.trim();

    // Get the full teacher object from localStorage
    const likedTeachers = JSON.parse(localStorage.getItem("likedTeachers")) || [];
    const selectedTeacher = likedTeachers.find(t => t.name === teacherName);

    if (selectedTeacher) {
      localStorage.setItem("selectedTeacher", JSON.stringify(selectedTeacher));
      window.location.href = "/html/bookSession.html";
    } else {
      console.error("Teacher not found in likedTeachers:", teacherName);
    }
  }
});