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

  // Avatar dropdown toggle
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
        <div class="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-8">
  <div class="flex items-center gap-6">
    <img src="/img/pfp.jpg" alt="Teacher Profile" class="w-24 h-24 rounded-full object-cover shadow-sm" />
    <div>
      <h2 class="text-3xl font-extrabold text-blue-600 leading-tight">${teacher.name}</h2>
      <p class="mt-1 text-lg text-gray-700 tracking-wide">${teacher.subject} • ${teacher.level}</p>
    </div>
  </div>

  <ul class="text-gray-800 space-y-4 text-base leading-relaxed font-medium">
    <li class="flex items-center gap-3"><i class="fa-solid fa-coins text-blue-500 text-xl"></i> €${teacher.price}</li>
    <li class="flex items-center gap-3"><i class="fa-solid fa-map-marker-alt text-blue-500 text-xl"></i> ${teacher.location}</li>
    <li class="flex items-center gap-3"><i class="fa-solid fa-star text-yellow-400 text-xl"></i> ${teacher.rating}/5</li>
    <li class="flex items-center gap-3"><i class="fa-solid fa-clock text-blue-500 text-xl"></i> ${teacher.days.join(", ")}</li>
    <li class="flex items-center gap-3"><i class="fa-solid fa-user-graduate text-blue-500 text-xl"></i> ${teacher.classType}</li>
    <li class="flex items-center gap-3"><i class="fa-solid fa-info-circle text-blue-500 text-xl"></i> ${teacher.description}</li>
  </ul>

  <div class="flex gap-4 ">
    <button class="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition duration-300">
      <img src="https://img.icons8.com/?size=100&id=59753&format=png&color=ffffff" class="w-4 h-4" alt="Chat" />
      Text
    </button>
    <button class="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition duration-300">
      <img src="https://img.icons8.com/?size=100&id=238Ts6gRDGws&format=png&color=ffffff" class="w-4 h-4" alt="Call" />
      Call
    </button>
    <button class="book-now-btn flex-1 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition duration-300 font-semibold">
      Book Now
    </button>
  </div>
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

window.addEventListener("click", function (e) {
  if (!avatarButton.contains(e.target) && !sidebarMenu.contains(e.target)) {
    sidebarMenu.style.display = "none";
  }
});
  const logoutButton = document.getElementById("logoutButton");

  logoutButton.addEventListener("click", () => {
    // Clear all localStorage data
    localStorage.clear();

    // redirect to index.html
    window.location.href = "/index.html";
  });