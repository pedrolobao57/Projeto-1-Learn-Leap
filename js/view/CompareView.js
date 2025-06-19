    const likedTeachers = JSON.parse(localStorage.getItem("likedTeachers")) || [];
    const container = document.getElementById("likedContainer");

    if (likedTeachers.length === 0) {
      container.innerHTML = "<p class='text-center text-gray-500 col-span-3'>No liked teachers found.</p>";
    } else {
      likedTeachers.forEach(teacher => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded-xl shadow border border-blue-200 flex flex-col justify-between";
        card.innerHTML = `
          <div>
            <div class="flex items-center gap-4">
              <img src="/img/pfp.jpg" class="w-16 h-16 rounded-full object-cover" />
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
          <button class="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Book Now</button>
        `;
        container.appendChild(card);
      });
    }