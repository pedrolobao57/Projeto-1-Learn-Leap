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
