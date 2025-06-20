document.querySelector(".submit-btn").addEventListener("click", () => {
  const emailInput = document.getElementById("loginEmail").value.trim();
  const passwordInput = document.getElementById("loginPassword").value.trim();

  const teachers = JSON.parse(localStorage.getItem("teacherAccounts")) || [];
  const students = JSON.parse(localStorage.getItem("studentAccounts")) || [];

  let user = teachers.find(
    (u) => u.email === emailInput && u.password === passwordInput
  );

  let role = "teacher";

  if (!user) {
    user = students.find(
      (u) => u.email === emailInput && u.password === passwordInput
    );
    role = user ? "student" : null;
  }

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    localStorage.setItem("loggedInRole", role);

    alert(`Login feito com sucesso como ${role === "teacher" ? "Professor" : "Aluno"}`);

    if (role === "teacher") {
      window.location.href = "teacherHome.html";
    } else if (role === "student") {
      window.location.href = "studentHome.html";
    }
  } else {
    alert("Email ou password incorretos.");
  }
});