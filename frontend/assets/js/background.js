const backgrounds = [
  '../assets/images/bg3.jpg'
];

let currentBg = 0;

function changeBackground() {
  document.body.style.backgroundImage = `url('${backgrounds[currentBg]}')`;
  currentBg = (currentBg + 1) % backgrounds.length;
}

changeBackground();

setInterval(changeBackground, 8000);