/* 1. ALTERNÂNCIA DE ABAS (LOGIN, CADASTRO, MFA E RECUPERAÇÃO) */
const panelLogin = document.getElementById('panelLogin');
const panelSignup = document.getElementById('panelSignup');
const panelForgot = document.getElementById('panelForgot');
const panelMFA = document.getElementById('panelMFA');

function hideAllPanels() {
  if (panelLogin) panelLogin.classList.remove('active');
  if (panelSignup) panelSignup.classList.remove('active');
  if (panelForgot) panelForgot.classList.remove('active');
  if (panelMFA) panelMFA.classList.remove('active');
}

function showLogin() { hideAllPanels(); if (panelLogin) panelLogin.classList.add('active'); }
function showSignup() { hideAllPanels(); if (panelSignup) panelSignup.classList.add('active'); }
function showForgot() { hideAllPanels(); if (panelForgot) panelForgot.classList.add('active'); }
function showMFA() { hideAllPanels(); if (panelMFA) panelMFA.classList.add('active'); }

document.addEventListener('click', function(e) {
  const targetId = e.target.id;
  if (targetId === 'goSignup') { e.preventDefault(); showSignup(); }
  else if (targetId === 'goLogin' || targetId === 'goBackLogin') { e.preventDefault(); showLogin(); }
  else if (targetId === 'goForgot') { e.preventDefault(); showForgot(); }
  else if (targetId === 'goBackSignup') { e.preventDefault(); showSignup(); }
});

/* 2. VISIBILIDADE DA SENHA */
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const inputId = btn.getAttribute('data-target');
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      btn.innerHTML = `<svg class="eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>`;
    } else {
      input.type = 'password';
      btn.innerHTML = `<svg class="eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
  });
});

/* 3. MÁSCARA DE TELEFONE */
const inputPhone = document.getElementById('signupPhone');
if (inputPhone) {
  inputPhone.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    else if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    else if (value.length > 0) value = `(${value}`;
    e.target.value = value;
  });
}

/* 4. VALIDAÇÃO EM TEMPO REAL */
const inputName = document.getElementById('signupName');
const nameHelp = document.getElementById('nameHelp');
if (inputName && nameHelp) {
  inputName.addEventListener('input', function() {
    const value = this.value.trim();
    const isValidName = /^[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(value);
    if (value.length === 0) nameHelp.className = 'help-text';
    else if (isValidName) nameHelp.className = 'help-text success-text';
    else nameHelp.className = 'help-text error-text';
  });
}

const inputPass = document.getElementById('signupPass');
const passHelp = document.getElementById('passHelp');
if (inputPass && passHelp) {
  inputPass.addEventListener('input', function() {
    const value = this.value;
    if (value.length === 0) passHelp.className = 'help-text';
    else if (value.length >= 8 && /\d/.test(value) && /[A-Z]/.test(value)) passHelp.className = 'help-text success-text';
    else passHelp.className = 'help-text error-text';
  });
}

/* 5. CADASTRO E MFA */
const signupSubmit = document.getElementById('signupSubmit');
if (signupSubmit) {
  signupSubmit.addEventListener('click', function(e) {
    e.preventDefault();
    const name = inputName ? inputName.value.trim() : '';
    const phone = inputPhone ? inputPhone.value.trim() : '';
    const email = document.getElementById('signupEmail')?.value.trim() || '';
    const pass = inputPass ? inputPass.value : '';
    
    if (name.split(/\s+/).length < 2 || phone.replace(/\D/g, '').length < 10 || !email || !pass) {
      alert('Preencha todos os campos corretamente.');
      return;
    }
    const displayPhone = document.getElementById('displayPhone');
    if (displayPhone) displayPhone.textContent = phone;
    showMFA();
  });
}

const mfaSubmit = document.getElementById('mfaSubmit');
if (mfaSubmit) {
  mfaSubmit.addEventListener('click', function(e) {
    e.preventDefault();
    const code = document.getElementById('mfaCode')?.value.trim();
    if (code?.length === 6) {
      alert('Conta verificada com sucesso!');
      window.location.href = 'dashboard.html';
    } else {
      alert('Digite um código de 6 dígitos.');
    }
  });
}

/* 6. DARK MODE */
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

if (localStorage.getItem('inspira-theme') === 'dark') {
  document.body.classList.add('dark-mode');
  updateThemeIcon(true);
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('inspira-theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
  });
}

function updateThemeIcon(isDark) {
  if (!themeIcon) return;
  if (isDark) {
    themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
  } else {
    themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  }
}

/* 7. ROTAÇÃO DE TEXTO DO LOGIN */
const rotatingTexts = ["entrar na TI de verdade", "construir sua carreira em tech", "conquistar o primeiro emprego", "evoluir com mentores reais"];
let currentIndex = 0;
const rotatingTextElement = document.getElementById('rotatingText');
if (rotatingTextElement) {
  setInterval(() => {
    rotatingTextElement.classList.add('fade-out');
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % rotatingTexts.length;
      rotatingTextElement.textContent = rotatingTexts[currentIndex];
      rotatingTextElement.classList.remove('fade-out');
    }, 400);
  }, 3000);
}

/* 8. CONTROLE DIRETO E GARANTIDO DO MODAL DE CALENDÁRIO */
window.addEventListener('load', () => {
  const openBtn = document.getElementById('openCalendarBtn');
  const modal = document.getElementById('calendarModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const confirmBtn = document.getElementById('confirmBookingBtn');
  const slots = document.querySelectorAll('.time-slot');
  let chosenSlot = "15 Mai - 16:00";

  if (openBtn && modal) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      slots.forEach(s => s.classList.remove('active-slot'));
      slot.classList.add('active-slot');
      chosenSlot = slot.getAttribute('data-time');
    });
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const select = document.getElementById('mentorSelect');
      const mentor = select ? select.options[select.selectedIndex].text.split('—')[0].trim() : 'Mentor';
      alert(`Mentoria agendada com sucesso!\n\nProfissional: ${mentor}\nHorário: ${chosenSlot}`);
      if (modal) modal.classList.remove('active');
    });
  }
});