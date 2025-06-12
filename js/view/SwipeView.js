
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

    let wave1 = document.getElementById("wave1");
let wave2 = document.getElementById("wave2");
let wave3 = document.getElementById("wave3");
let wave4 = document.getElementById("wave4");

window.addEventListener("scroll", function () {
  let value = window.scrollY;
  wave1.style.backgroundPositionX = 400 + value + "px";
  wave2.style.backgroundPositionX = 300 + value + "px";
  wave3.style.backgroundPositionX = 200 + value + "px";
  wave4.style.backgroundPositionX = 100 + value + "px";
});
