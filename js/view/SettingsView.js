function setupDropdown(buttonId, menuId, inputId) {
        const btn = document.getElementById(buttonId);
        const menu = document.getElementById(menuId);
        const input = document.getElementById(inputId);

        btn.addEventListener('click', () => {
          menu.classList.toggle('hidden');
        });

        menu.querySelectorAll('li').forEach((item) => {
          item.addEventListener('click', () => {
            btn.textContent = item.textContent;
            input.value = item.dataset.value;
            menu.classList.add('hidden');
          });
        });

        document.addEventListener('click', (e) => {
          if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
          }
        });
      }

      setupDropdown('subjectBtn', 'subjectMenu', 'subjectInput');
      setupDropdown('classTypeBtn', 'classTypeMenu', 'classTypeInput');
      setupDropdown('levelBtn', 'levelMenu', 'levelInput');

      // Checkbox values to hidden input
      const dayCheckboxes = document.querySelectorAll('.dayCheckbox');
      const daysSelected = document.getElementById('daysSelected');
      dayCheckboxes.forEach((box) =>
        box.addEventListener('change', () => {
          const selected = Array.from(dayCheckboxes)
            .filter((cb) => cb.checked)
            .map((cb) => cb.value);
          daysSelected.value = selected.join(',');
        })
      );