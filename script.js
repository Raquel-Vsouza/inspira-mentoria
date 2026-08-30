/* 1. ALTERNÂNCIA DE ABAS (LOGIN, CADASTRO, MFA E RECUPERAÇÃO) */
const panelLogin = document.getElementById('panelLogin');
const panelSignup = document.getElementById('panelSignup');
const panelForgot = document.getElementById('panelForgot');
const panelMFA = document.getElementById('panelMFA'); // Nova aba MFA

function hideAllPanels() {
  if (panelLogin) panelLogin.classList.remove('active');
  if (panelSignup) panelSignup.classList.remove('active');
  if (panelForgot) panelForgot.classList.remove('active');
  if (panelMFA) panelMFA.classList.remove('active');
}

function showLogin(){ hideAllPanels(); if (panelLogin) panelLogin.classList.add('active'); }
function showSignup(){ hideAllPanels(); if (panelSignup) panelSignup.classList.add('active'); }
function showForgot(){ hideAllPanels(); if (panelForgot) panelForgot.classList.add('active'); }
function showMFA(){ hideAllPanels(); if (panelMFA) panelMFA.classList.add('active'); } // Exibe MFA

// Eventos de clique para navegação
const goSignupBtn = document.getElementById('goSignup');
const goLoginBtn = document.getElementById('goLogin');
const goForgotBtn = document.getElementById('goForgot');
const goBackLoginBtn = document.getElementById('goBackLogin');
const goBackSignupBtn = document.getElementById('goBackSignup');

if (goSignupBtn) goSignupBtn.addEventListener('click', showSignup);
if (goLoginBtn) goLoginBtn.addEventListener('click', showLogin);
if (goForgotBtn) goForgotBtn.addEventListener('click', showForgot);
if (goBackLoginBtn) goBackLoginBtn.addEventListener('click', showLogin);
if (goBackSignupBtn) goBackSignupBtn.addEventListener('click', showSignup);

/* 2. VISIBILIDADE DA SENHA */
document.querySelectorAll('.toggle-pass').forEach(btn=>{
  btn.addEventListener('click', ()=>{
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

/* 3. ATUALIZAÇÃO DA CARTEIRINHA EM TEMPO REAL */
const inputName = document.getElementById('signupName');
const inputUni = document.getElementById('signupUni');
const inputCurso = document.getElementById('signupCurso');
const cardName = document.querySelector('.id-name');
const cardUniValues = document.querySelectorAll('.id-field-value');

if (inputName && cardName) {
  inputName.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    cardName.textContent = val.length > 0 ? val : 'Seu nome aqui';
  });
}

if (inputUni && cardUniValues.length > 0) {
  inputUni.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    cardUniValues[0].textContent = val.length > 0 ? val : 'a preencher';
  });
}

if (inputCurso && cardUniValues.length > 1) {
  inputCurso.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    cardUniValues[1].textContent = val.length > 0 ? val : 'a preencher';
  });
}

/* 4. VALIDAÇÃO EM TEMPO REAL (NOME COMPLETO E SENHA) */
const nameHelp = document.getElementById('nameHelp');
if (inputName && nameHelp) {
  inputName.addEventListener('input', function() {
    const value = this.value.trim();
    const isValidName = /^[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(value);
    if (value.length === 0) { nameHelp.classList.remove('error-text', 'success-text'); }
    else if (isValidName) { nameHelp.classList.remove('error-text'); nameHelp.classList.add('success-text'); }
    else { nameHelp.classList.remove('success-text'); nameHelp.classList.add('error-text'); }
  });
}

const inputPass = document.getElementById('signupPass');
const passHelp = document.getElementById('passHelp');
if (inputPass && passHelp) {
  inputPass.addEventListener('input', function() {
    const value = this.value;
    const hasLength = value.length >= 8;
    const hasNumber = /\d/.test(value);
    const hasUpper = /[A-Z]/.test(value);

    if (value.length === 0) { passHelp.classList.remove('error-text', 'success-text'); }
    else if (hasLength && hasNumber && hasUpper) { passHelp.classList.remove('error-text'); passHelp.classList.add('success-text'); }
    else { passHelp.classList.remove('success-text'); passHelp.classList.add('error-text'); }
  });
}

/* 5. AÇÃO DO BOTÃO DE CADASTRO (ENVIA PARA ABA DE MFA) */
const signupSubmit = document.getElementById('signupSubmit');
if (signupSubmit) {
  signupSubmit.addEventListener('click', function () {
    const name = inputName ? inputName.value.trim() : '';
    const phone = document.getElementById('signupPhone').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pass = inputPass ? inputPass.value : '';

    const nameParts = name.split(/\s+/);
    const isValidName = nameParts.length >= 2 && nameParts[1] !== '';
    const phoneDigits = phone.replace(/\D/g, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;

    // Checa se todos os critérios estão válidos
    if (!isValidName || phoneDigits.length < 10 || !emailRegex.test(email) || !passwordRegex.test(pass)) {
      return; // Impede o avanço se faltar algo
    }

    // Passa o número de telefone para o painel de MFA e exibe a aba
    const displayPhone = document.getElementById('displayPhone');
    if (displayPhone) displayPhone.textContent = phone;
    showMFA();
  });
}

/* 6. AÇÃO DO BOTÃO DE VALIDAR CÓDIGO MFA */
const mfaSubmit = document.getElementById('mfaSubmit');
if (mfaSubmit) {
  mfaSubmit.addEventListener('click', function() {
    const codeInput = document.getElementById('mfaCode');
    const code = codeInput.value.trim();
    
    // Validação simples simulando que o código precisa ter 6 caracteres
    if (code.length === 6) {
      // Limpa formulário após sucesso completo
      if (inputName) inputName.value = '';
      if (inputUni) inputUni.value = '';
      if (inputCurso) inputCurso.value = '';
      document.getElementById('signupEmail').value = '';
      document.getElementById('signupPhone').value = '';
      if (inputPass) inputPass.value = '';
      codeInput.value = '';
      codeInput.style.borderColor = 'var(--field-border)';
      
      if (cardName) cardName.textContent = 'Seu nome aqui';
      if (cardUniValues.length > 0) cardUniValues[0].textContent = 'a preencher';
      if (cardUniValues.length > 1) cardUniValues[1].textContent = 'a preencher';
      if (nameHelp) nameHelp.classList.remove('success-text', 'error-text');
      if (passHelp) passHelp.classList.remove('success-text', 'error-text');

      showLogin(); // Redireciona para o login após verificar o código
    } else {
      codeInput.style.borderColor = '#d9534f'; // Borda vermelha se o código for inválido
    }
  });
}

/* 7. EFEITO DE INCLINAÇÃO 3D NA CARTEIRINHA */
const stage = document.getElementById('cardStage');
const card = document.getElementById('idCard');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if(!reduceMotion && stage && card){
  stage.addEventListener('mousemove', (e)=>{
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${8 - y*14}deg) rotateY(${-14 + x*20}deg)`;
  });
  stage.addEventListener('mouseleave', ()=>{
    card.style.transform = 'rotateX(8deg) rotateY(-14deg)';
  });
}