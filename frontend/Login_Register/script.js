const loginBg = '../assets/images/bg1.jpg';
const registerBg = '../assets/images/bg2.jpg';

document.body.style.backgroundImage = `url('${loginBg}')`;

function goToMain() {
  window.location.href = "../index.html";
}

function toggleForms() {
  const loginCard = document.getElementById('login-card');
  const registerCard = document.getElementById('register-card');

  const isRegisterVisible = !registerCard.classList.contains('hidden');

  loginCard.classList.toggle('hidden');
  registerCard.classList.toggle('hidden');

  if (!isRegisterVisible) {
    document.body.style.backgroundImage = `url('${registerBg}')`;
  } else {
    document.body.style.backgroundImage = `url('${loginBg}')`;
  }
}





