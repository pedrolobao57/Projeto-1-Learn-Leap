
    const stack = document.getElementById('card-stack');

    function handleSwipe(direction) {
      const topCard = stack.querySelector('.card:last-child');
      if (!topCard) return;

      topCard.style.transform = `translateX(${direction === 'accept' ? '' : '-'}400px) rotate(${direction === 'accept' ? '' : '-'}30deg)`;
      topCard.style.opacity = '0';
      setTimeout(() => {
        topCard.remove();
      }, 300);
    }

    document.querySelectorAll('.accept').forEach(btn =>
      btn.addEventListener('click', () => handleSwipe('accept'))
    );
    document.querySelectorAll('.decline').forEach(btn =>
      btn.addEventListener('click', () => handleSwipe('decline'))
    );
