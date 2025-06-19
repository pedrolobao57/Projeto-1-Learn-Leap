    const STORAGE_KEY = "randomTeachers";

    function generateRandomTeachers(num = 50) {
      const subjects = ["Maths", "Science", "English", "Portuguese"];
      const classesTypes = ["In Person", "Online", "Both"];
      const levels = ["Primary School", "Basic", "High School", "University"];
      const locations = [
        "Aveiro","Beja","Braga","Bragança","Castelo Branco","Coimbra","Évora","Faro","Guarda",
        "Leiria","Lisboa","Portalegre","Porto","Santarém","Setúbal","Viana do Castelo","Vila Real","Viseu",
      ];
      const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

      function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      function randomName() {
        const firstNames = ["Alex","Maria","John","Sofia","Carlos","Ana","Luis","Isabel","João","Inês",
          "Miguel","Helena","Pedro","Clara","Ricardo","Beatriz","Duarte","Marta","Tiago","Carla",
          "Rui","Sandra","Nuno","Patrícia","Fábio"];
        const lastNames = ["Silva","Costa","Martins","Ferreira","Santos","Pereira","Oliveira","Gomes",
          "Ribeiro","Alves","Carvalho","Rodrigues","Lopes","Soares","Fernandes","Barbosa","Moura",
          "Pinto","Dias","Sousa","Neves","Correia","Mendes","Cruz"];
        return randomChoice(firstNames) + " " + randomChoice(lastNames);
      }

      function randomPrice() {
        const multiples = [10, 15, 20, 25, 30, 35, 40, 45];
        return randomChoice(multiples);
      }

      const teachers = [];
      for (let i = 0; i < num; i++) {
        const name = randomName();
        const teacher = {
          name,
          rating: Math.floor(Math.random() * 5) + 1,
          subject: randomChoice(subjects),
          classType: randomChoice(classesTypes),
          level: randomChoice(levels),
          location: randomChoice(locations),
          price: randomPrice(),
          days: daysOfWeek.filter(() => Math.random() > 0.5),
          description: "Experienced teacher passionate about helping students succeed.",
        };
        if (teacher.days.length === 0) teacher.days.push(randomChoice(daysOfWeek));
        teachers.push(teacher);
      }
      return teachers;
    }

    function loadTeachers() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Erro ao ler localStorage:", e);
        }
      }
      const generated = generateRandomTeachers();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(generated));
      return generated;
    }

    function updateLocalStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
    }

    const cardContainer = document.getElementById("cardContainer");
    const finishBtn = document.getElementById("finishBtn");

    let teachers = loadTeachers();
    let currentIndex = teachers.length - 1;
    
    function createCard(teacher) {
      const card = document.createElement("div");
      card.classList.add(
        "cardContainer",
        "absolute",
        "w-full",
        "h-full",
        "bg-white",
        "rounded-xl",
        "border",
        "border-blue-300",
        "transition-transform",
        "duration-300",
        "ease-in-out"
      );

      card.innerHTML = `
        <div class="absolute inset-0 bg-white rounded-2xl flex flex-col justify-between p-4">
          <div class="flex flex-col sm:flex-row items-center gap-4 p-2">
            <img src="/img/pfp.jpg" alt="Teacher" class="w-24 h-24 sm:w-28 sm:h-28 rounded-[15%] object-cover" />
            <div class="flex flex-col justify-center w-full sm:w-3/5 text-center sm:text-left">
              <h5 class="text-2xl font-bold text-[#2286ff] font-sans">${teacher.name}</h5>
              <p class="text-base mt-1 flex items-center justify-center sm:justify-start text-gray-700">
                <i class="fa-solid fa-coins text-[#2286ff] mr-2"></i> €${teacher.price}
              </p>
              <p class="text-base flex items-center justify-center sm:justify-start text-gray-700">
                <i class="fa-solid fa-star text-[#2286ff] mr-2"></i>${teacher.rating} / 5
              </p>
              <p class="text-base flex items-center justify-center sm:justify-start text-gray-700">
                <i class="fa-solid fa-user-graduate text-[#2286ff] mr-2"></i> ${teacher.level}
              </p>
            </div>
          </div>

          <ul class="flex flex-col px-6 pb-4 text-base text-gray-800 font-semibold space-y-2">
            <li class="flex items-center"><i class="fa-solid fa-book text-[#2286ff] mr-3"></i> ${teacher.subject}</li>
            <li class="flex items-center"><i class="fa-solid fa-map-marker-alt text-[#2286ff] mr-3"></i> ${teacher.location}</li>
            <li class="flex items-center"><i class="fa-solid fa-chalkboard-teacher text-[#2286ff] mr-3"></i> ${teacher.classType}</li>
            <li class="flex items-center"><i class="fa-solid fa-clock text-[#2286ff] mr-3"></i> ${teacher.days.join(", ")}</li>
            <li class="flex items-center"><i class="fa-solid fa-info-circle text-[#2286ff] mr-3"></i> ${teacher.description}</li>
          </ul>

          <div class="w-full flex justify-center gap-6 px-4 pb-4 mt-2">
            <button class="btn decline w-1/2 py-2 bg-[#2286ff] text-white rounded-full shadow-md hover:bg-blue-600 transition">
              <i class="fa-solid fa-xmark text-xl"></i>
            </button>
            <button class="btn accept w-1/2 py-2 bg-[#2286ff] text-white rounded-full shadow-md hover:bg-blue-600 transition">
              <i class="fa-solid fa-check text-xl"></i>
            </button>
          </div>
        </div>
      `;

      let offsetX = 0, offsetY = 0, startX = 0, startY = 0;
      let isDragging = false;

      function onDragStart(e) {
        isDragging = true;
        startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        startY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
        card.style.transition = "none";
      }

      function onDragMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        const currentY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
        offsetX = currentX - startX;
        offsetY = currentY - startY;
        card.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX / 10}deg)`;
      }

      function onDragEnd() {
        isDragging = false;
        if (offsetX > 120) {
          swipe("like");
        } else if (offsetX < -120) {
          swipe("dislike");
        } else {
          card.style.transition = "transform 0.3s ease";
          card.style.transform = "translate(0,0) rotate(0)";
        }
        offsetX = 0;
        offsetY = 0;
      }

      card.addEventListener("mousedown", onDragStart);
      card.addEventListener("touchstart", onDragStart);
      window.addEventListener("mousemove", onDragMove);
      window.addEventListener("touchmove", onDragMove);
      window.addEventListener("mouseup", onDragEnd);
      window.addEventListener("touchend", onDragEnd);

      card.querySelector(".btn.decline").addEventListener("click", () => swipe("dislike"));
      card.querySelector(".btn.accept").addEventListener("click", () => swipe("like"));

      return card;
    }

    function renderCards() {
      cardContainer.innerHTML = "";
      for (let i = 0; i <= currentIndex; i++) {
        const card = createCard(teachers[i]);
        card.style.zIndex = i;
        cardContainer.appendChild(card);
      }
    }

    function updateFinishBtnVisibility() {
      const likedTeachers = JSON.parse(localStorage.getItem("likedTeachers")) || [];
      finishBtn.style.display = likedTeachers.length > 0 ? "block" : "none";
    }

    function swipe(action) {
      if (currentIndex < 0) return;
      const card = cardContainer.children[currentIndex];
      if (!card) return;

      const swipedTeacher = teachers[currentIndex];
      if (action === "like") {
        const likedKey = "likedTeachers";
        const saved = JSON.parse(localStorage.getItem(likedKey)) || [];
        saved.push(swipedTeacher);
        localStorage.setItem(likedKey, JSON.stringify(saved));

        updateFinishBtnVisibility();
      }

      const toRight = action === "like";
      card.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";
      card.style.transform = `translateX(${toRight ? 1000 : -1000}px) rotate(${toRight ? 45 : -45}deg)`;
      card.style.opacity = "0";

      setTimeout(() => {
        teachers.splice(currentIndex, 1);
        currentIndex--;
        updateLocalStorage();
        renderCards();

        if (currentIndex < 0) {
          cardContainer.innerHTML = `
            <div class="text-center mt-20">
              <p class='text-gray-400 mb-4'>No more teachers that match your criteria!</p>
              <button id="reloadBtn" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Generate More</button>
            </div>
          `;
          document.getElementById("reloadBtn").addEventListener("click", () => {
            const newTeachers = generateRandomTeachers(20);
            teachers = newTeachers;
            currentIndex = newTeachers.length - 1;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newTeachers));
            renderCards();
          });
        }
      }, 500);
    }

    finishBtn.addEventListener("click", () => {
      window.location.href = "/html/compare.html";
    });

    // Mostrar o botão caso já tenha likes no começo
    updateFinishBtnVisibility();
    renderCards();
    clearLocalStorage.setItem("likedTeachers", JSON.stringify([])); // Limpar likes ao iniciar