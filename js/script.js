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

function showLogin() { 
  hideAllPanels(); 
  if (panelLogin) panelLogin.classList.add('active'); 
}

function showSignup() { 
  hideAllPanels(); 
  if (panelSignup) panelSignup.classList.add('active'); 
}

function showForgot() { 
  hideAllPanels(); 
  if (panelForgot) panelForgot.classList.add('active'); 
}

function showMFA() { 
  hideAllPanels(); 
  if (panelMFA) panelMFA.classList.add('active'); 
}

// Delegação global segura de cliques para navegação entre as telas
document.addEventListener('click', function(e) {
  const targetId = e.target.id;
  
  if (targetId === 'goSignup') {
    e.preventDefault();
    showSignup();
  } else if (targetId === 'goLogin' || targetId === 'goBackLogin') {
    e.preventDefault();
    showLogin();
  } else if (targetId === 'goForgot') {
    e.preventDefault();
    showForgot();
  } else if (targetId === 'goBackSignup') {
    e.preventDefault();
    showSignup();
  }
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

/* 3. MÁSCARA AUTOMÁTICA PARA TELEFONE */
const inputPhone = document.getElementById('signupPhone');
if (inputPhone) {
  inputPhone.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    e.target.value = value;
  });
}

/* 4. VALIDAÇÃO EM TEMPO REAL (NOME COMPLETO E SENHA) */
const inputName = document.getElementById('signupName');
const nameHelp = document.getElementById('nameHelp');
if (inputName && nameHelp) {
  inputName.addEventListener('input', function() {
    const value = this.value.trim();
    const isValidName = /^[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/.test(value);
    if (value.length === 0) { 
      nameHelp.classList.remove('error-text', 'success-text'); 
    } else if (isValidName) { 
      nameHelp.classList.remove('error-text'); 
      nameHelp.classList.add('success-text'); 
    } else { 
      nameHelp.classList.remove('success-text'); 
      nameHelp.classList.add('error-text'); 
    }
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

    if (value.length === 0) { 
      passHelp.classList.remove('error-text', 'success-text'); 
    } else if (hasLength && hasNumber && hasUpper) { 
      passHelp.classList.remove('error-text'); 
      passHelp.classList.add('success-text'); 
    } else { 
      passHelp.classList.remove('success-text'); 
      passHelp.classList.add('error-text'); 
    }
  });
}

/* 5. AÇÃO DO BOTÃO DE CADASTRO (ENVIA PARA ABA DE MFA) */
const signupSubmit = document.getElementById('signupSubmit');
if (signupSubmit) {
  signupSubmit.addEventListener('click', function(e) {
    e.preventDefault();

    const name = inputName ? inputName.value.trim() : '';
    const phone = inputPhone ? inputPhone.value.trim() : '';
    const emailInput = document.getElementById('signupEmail');
    const email = emailInput ? emailInput.value.trim() : '';
    const pass = inputPass ? inputPass.value : '';

    const nameParts = name.split(/\s+/);
    const isValidName = nameParts.length >= 2 && nameParts[1] !== '';
    const phoneDigits = phone.replace(/\D/g, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!isValidName || phoneDigits.length < 10 || !emailRegex.test(email) || !passwordRegex.test(pass)) {
      alert('Por favor, preencha todos os campos corretamente seguindo os requisitos de nome e senha.');
      return; 
    }

    const displayPhone = document.getElementById('displayPhone');
    if (displayPhone) displayPhone.textContent = phone;
    showMFA();
  });
}

/* 6. AÇÃO DO BOTÃO DE VALIDAR CÓDIGO MFA */
const mfaSubmit = document.getElementById('mfaSubmit');
if (mfaSubmit) {
  mfaSubmit.addEventListener('click', function(e) {
    e.preventDefault();
    const codeInput = document.getElementById('mfaCode');
    if (!codeInput) return;
    
    const code = codeInput.value.trim();

    if (code.length === 6) {
      if (inputName) inputName.value = '';
      const uni = document.getElementById('signupUni');
      const curso = document.getElementById('signupCurso');
      const email = document.getElementById('signupEmail');
      
      if (uni) uni.value = '';
      if (curso) curso.value = '';
      if (email) email.value = '';
      if (inputPhone) inputPhone.value = '';
      if (inputPass) inputPass.value = '';
      
      codeInput.value = '';
      codeInput.style.borderColor = 'var(--field-border)';

      if (nameHelp) nameHelp.classList.remove('success-text', 'error-text');
      if (passHelp) passHelp.classList.remove('success-text', 'error-text');

      alert('Conta criada e verificada com sucesso!');
      showLogin();
    } else {
      codeInput.style.borderColor = '#d9534f';
      alert('Digite um código válido de 6 dígitos.');
    }
  });
}

/* 7. CONTROLE DO DARK MODE */
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

// Restaura a preferência salva do usuário ao carregar a página
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
    // Ícone de Sol
    themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
  } else {
    // Ícone de Lua
    themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  }
}