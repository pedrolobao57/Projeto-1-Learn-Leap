export const BookSessionModel = {
  getSelectedTeacher() {
    const data = localStorage.getItem("selectedTeacher");
    if (!data) {
      console.warn("No selectedTeacher found in localStorage");
      return null;
    }

    try {
      return JSON.parse(data);
    } catch (err) {
      console.error("Failed to parse selectedTeacher from localStorage:", err);
      return null;
    }
  },

  setSelectedTeacher(teacher) {
    if (!teacher || typeof teacher !== "object") {
      console.warn("Invalid teacher passed to setSelectedTeacher", teacher);
      return;
    }
    localStorage.setItem("selectedTeacher", JSON.stringify(teacher));
  },

  clearSelectedTeacher() {
    localStorage.removeItem("selectedTeacher");
  },

  bookLesson(teacher, formData) {
    if (!teacher || !teacher.name) {
      console.error("Invalid teacher passed to bookLesson:", teacher);
      return false;
    }

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push({
      teacher,
      formData,
      bookedAt: new Date().toISOString(),
    });
    localStorage.setItem("bookings", JSON.stringify(bookings));
    return true;
  },
};