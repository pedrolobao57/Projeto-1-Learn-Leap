export const BookSessionView = {
  renderTeacherInfo(teacher) {
    const container = document.getElementById("teacherInfo");
    if (!container || !teacher) return;

    container.innerHTML = `
      <h2 class="text-xl font-semibold mb-2">${teacher.name}</h2>
      <p><strong>Subject:</strong> ${teacher.subject}</p>
      <p><strong>Location:</strong> ${teacher.location}</p>
      <p><strong>Price:</strong> €${teacher.price}</p>
    `;

    const daySelect = document.getElementById("daySelect");
    if (daySelect && Array.isArray(teacher.days)) {
      daySelect.innerHTML = "";
      teacher.days.forEach(day => {
        const option = document.createElement("option");
        option.value = day;
        option.textContent = day;
        daySelect.appendChild(option);
      });
    }
  },

  onSubmit(callback) {
    const form = document.getElementById("bookingForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const day = document.getElementById("daySelect").value;
      const time = document.getElementById("timeInput").value;
      const notes = document.getElementById("notes").value.trim();

      const formData = { day, time, notes };

      callback(formData);

      // Exibe a mensagem de confirmação
      document.getElementById("confirmation").classList.remove("hidden");
      form.reset();

      // Redireciona para studentHome.html após 1.5 segundos
      setTimeout(() => {
        window.location.href = "studentHome.html"; // ajuste o caminho se necessário
      }, 1500);
    });
  },

  showNoTeacher() {
    const container = document.getElementById("teacherInfo");
    if (container) {
      container.innerHTML = "<p class='text-red-600 font-semibold'>No teacher selected. Please go back and choose one.</p>";
    }
  },
};
