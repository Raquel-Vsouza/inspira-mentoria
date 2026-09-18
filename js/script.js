/* =========================================
   1. ALTERNÂNCIA DE ABAS (LOGIN, CADASTRO, MFA E RECUPERAÇÃO)
   ========================================= */
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

/* =========================================
   2. VISIBILIDADE DA SENHA
   ========================================= */
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

/* =========================================
   3. MÁSCARA AUTOMÁTICA PARA TELEFONE
   ========================================= */
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

/* =========================================
   4. VALIDAÇÃO EM TEMPO REAL (NOME COMPLETO E SENHA)
   ========================================= */
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

/* =========================================
   5. AÇÃO DO BOTÃO DE CADASTRO (ENVIA PARA ABA DE MFA)
   ========================================= */
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

/* =========================================
   6. AÇÃO DO BOTÃO DE VALIDAR CÓDIGO MFA
   ========================================= */
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

/* =========================================
   7. CONTROLE DO DARK MODE (CLARO / ESCURO)
   ========================================= */
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

// Verifica preferência salva ou aplica Dark Mode se for a primeira vez
const savedTheme = localStorage.getItem('inspira-theme');
if (savedTheme === 'dark' || !savedTheme) {
  document.body.classList.add('dark-mode');
  updateThemeIcon(true);
} else {
  document.body.classList.remove('dark-mode');
  updateThemeIcon(false);
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Salva a escolha do usuário
    localStorage.setItem('inspira-theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
  });
}

function updateThemeIcon(isDark) {
  if (!themeIcon) return;
  if (isDark) {
    // Exibe ícone de Sol (para mudar para tema claro)
    themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
  } else {
    // Exibe ícone de Lua (para mudar para tema escuro)
    themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  }
}

/* =========================================
   8. CONTROLE GLOBAL DO MODAL DE PERFIL DO USUÁRIO
   ========================================= */
window.isEditingProfile = false;

window.openUserProfileModal = function() {
  const modal = document.getElementById('userProfileModal');
  if (modal) {
    modal.classList.add('active');
  }
};

window.closeUserProfileModal = function() {
  if (window.isEditingProfile) {
    window.exitEditMode(false);
  }
  const modal = document.getElementById('userProfileModal');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.handleProfileEditClick = function() {
  if (!window.isEditingProfile) {
    window.enterEditMode();
  } else {
    window.saveProfileData();
    window.exitEditMode(true);
  }
};

window.handleProfileCancelClick = function() {
  if (window.isEditingProfile) {
    window.exitEditMode(false);
  } else {
    window.closeUserProfileModal();
  }
};

window.enterEditMode = function() {
  window.isEditingProfile = true;
  document.body.classList.add('is-editing-profile');

  const btnEdit = document.getElementById('btnEditProfile');
  const btnCancel = document.getElementById('btnCancelEdit');

  if (btnEdit) btnEdit.textContent = 'Salvar Alterações';
  if (btnCancel) btnCancel.textContent = 'Cancelar';
};

window.exitEditMode = function(saved) {
  window.isEditingProfile = false;
  document.body.classList.remove('is-editing-profile');

  const btnEdit = document.getElementById('btnEditProfile');
  const btnCancel = document.getElementById('btnCancelEdit');

  if (btnEdit) btnEdit.textContent = 'Editar Perfil';
  if (btnCancel) btnCancel.textContent = 'Sair';
};

window.saveProfileData = function() {
  const nameInput = document.getElementById('editNameInput');
  const ageInput = document.getElementById('editAgeInput');
  const emailInput = document.getElementById('editEmailInput');
  const courseInput = document.getElementById('editCourseInput');

  const newName = nameInput ? nameInput.value.trim() : '';
  const newAge = ageInput ? ageInput.value.trim() : '';
  const newEmail = emailInput ? emailInput.value.trim() : '';
  const newCourse = courseInput ? courseInput.value.trim() : '';

  // 1. Atualiza Nome e Iniciais do Avatar
  if (newName) {
    const nameDisplay = document.getElementById('profileNameDisplay');
    const headerName = document.getElementById('headerUserName') || document.querySelector('.dash-header .user-name');

    if (nameDisplay) nameDisplay.textContent = newName;
    if (headerName) headerName.textContent = newName;

    const parts = newName.split(' ').filter(p => p.length > 0);
    let initials = '';
    if (parts.length === 1) {
      initials = parts[0].substring(0, 2).toUpperCase();
    } else if (parts.length > 1) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    if (initials) {
      const modalAvatar = document.getElementById('profileAvatarDisplay');
      const headerAvatar = document.getElementById('headerUserAvatar') || document.querySelector('.dash-header .user-avatar');

      if (modalAvatar) modalAvatar.textContent = initials;
      if (headerAvatar) headerAvatar.textContent = initials;
    }
  }

  // 2. Atualiza Idade
  if (newAge) {
    const ageDisplay = document.getElementById('profileAgeDisplay');
    if (ageDisplay) ageDisplay.textContent = newAge.includes('ano') ? newAge : `${newAge} anos`;
  }

  // 3. Atualiza E-mail
  if (newEmail) {
    const emailDisplay = document.getElementById('profileEmailDisplay');
    if (emailDisplay) emailDisplay.textContent = newEmail;
  }

  // 4. Atualiza Curso / Foco
  if (newCourse) {
    const courseDisplay = document.getElementById('profileCourseDisplay');
    if (courseDisplay) courseDisplay.textContent = newCourse;
  }
};

/* =========================================
   9. INICIALIZAÇÃO DE OUTROS COMPONENTES (CALENDÁRIO, ETC)
   ========================================= */
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

/* =========================================
   10. CONTROLE DO TESTE VOCACIONAL (QUIZ)
   ========================================= */

// Conjunto "Rápido" — 5 perguntas
const tvQuestionsRapido = [
  {
    question: "O que você mais gosta de fazer no seu tempo livre?",
    options: [
      { text: "Criar programas, resolver problemas lógicos ou explorar novas tecnologias.", area: "Tecnologia" },
      { text: "Analisar dados, gerenciar orçamento ou entender o mercado financeiro.", area: "Finanças" },
      { text: "Criar conteúdos, planejar campanhas e entender o comportamento das pessoas.", area: "Marketing" },
      { text: "Idealizar novos negócios, liderar equipes e assumir riscos calculados.", area: "Empreendedorismo" }
    ]
  },
  {
    question: "Qual ambiente de trabalho mais atrai você?",
    options: [
      { text: "Empresa de tecnologia ou startups focadas em inovação digital.", area: "Tecnologia" },
      { text: "Bancos, corretoras ou setor financeiro corporativo.", area: "Finanças" },
      { text: "Agências de publicidade, mídias sociais ou setor criativo.", area: "Marketing" },
      { text: "Minha própria empresa ou gestão de novos projetos desafiadores.", area: "Empreendedorismo" }
    ]
  },
  {
    question: "Qual dessas habilidades você considera seu ponto forte?",
    options: [
      { text: "Raciocínio lógico e resolução de problemas complexos.", area: "Tecnologia" },
      { text: "Organização financeira, atenção a detalhes e análise numérica.", area: "Finanças" },
      { text: "Comunicação verbal/escrita e empatia com o público.", area: "Marketing" },
      { text: "Liderança, visão estratégica e tomada de decisão.", area: "Empreendedorismo" }
    ]
  },
  {
    question: "Como você prefere resolver um grande desafio?",
    options: [
      { text: "Desenvolvendo uma ferramenta, código ou automação.", area: "Tecnologia" },
      { text: "Calculando custos, riscos e otimizando investimentos.", area: "Finanças" },
      { text: "Criando uma narrativa ou estratégia de engajamento.", area: "Marketing" },
      { text: "Montando uma equipe competente e delegando tarefas.", area: "Empreendedorismo" }
    ]
  },
  {
    question: "Qual conquista profissional traria mais satisfação?",
    options: [
      { text: "Construir um software ou sistema usado por milhares de pessoas.", area: "Tecnologia" },
      { text: "Multiplicar capital e garantir estabilidade financeira.", area: "Finanças" },
      { text: "Tornar uma marca reconhecida nacional ou mundialmente.", area: "Marketing" },
      { text: "Fundar uma empresa de sucesso e gerar impacto no mercado.", area: "Empreendedorismo" }
    ]
  }
];

// Conjunto "Personalizado" — as 5 perguntas acima + mais 5 perguntas extras (10 no total)
const tvQuestionsPersonalizado = tvQuestionsRapido.concat([
  {
    question: "Qual tipo de conteúdo você mais consome ou estuda por curiosidade?",
    options: [
      { text: "Notícias e tutoriais sobre programação, IA e novas tecnologias.", area: "Tecnologia" },
      { text: "Análises de mercado, investimentos e economia.", area: "Finanças" },
      { text: "Tendências de redes sociais, branding e comportamento do consumidor.", area: "Marketing" },
      { text: "Histórias de fundadores, startups e cases de negócio.", area: "Empreendedorismo" }
    ]
  },
  {
    question: "Em um trabalho em grupo, qual papel você costuma assumir?",
    options: [
      { text: "O que resolve os problemas técnicos e estrutura a solução.", area: "Tecnologia" },
      { text: "O que organiza o orçamento e controla os recursos do projeto.", area: "Finanças" },
      { text: "O que cuida da apresentação, comunicação e divulgação do resultado.", area: "Marketing" },
      { text: "O que define a visão geral e distribui as responsabilidades.", area: "Empreendedorismo" }
    ]
  },
  {
    question: "O que mais te frustra em um projeto mal feito?",
    options: [
      { text: "Um sistema mal estruturado, lento ou cheio de bugs.", area: "Tecnologia" },
      { text: "Desperdício de dinheiro e falta de planejamento financeiro.", area: "Finanças" },
      { text: "Uma comunicação confusa que não engaja o público certo.", area: "Marketing" },
      { text: "Falta de visão estratégica e oportunidades perdidas.", area: "Empreendedorismo" }
    ]
  },
  {
    question: "Se você ganhasse um curso gratuito, qual escolheria?",
    options: [
      { text: "Desenvolvimento de software ou ciência de dados.", area: "Tecnologia" },
      { text: "Investimentos e planejamento financeiro pessoal.", area: "Finanças" },
      { text: "Marketing digital e criação de conteúdo.", area: "Marketing" },
      { text: "Gestão de negócios e liderança de equipes.", area: "Empreendedorismo" }
    ]
  },
  {
    question: "Qual dessas frases mais combina com você?",
    options: [
      { text: "\"Gosto de entender como as coisas funcionam por dentro.\"", area: "Tecnologia" },
      { text: "\"Gosto de planejar cada centavo e ver o retorno crescer.\"", area: "Finanças" },
      { text: "\"Gosto de conectar pessoas a ideias e marcas.\"", area: "Marketing" },
      { text: "\"Gosto de transformar uma ideia em um negócio real.\"", area: "Empreendedorismo" }
    ]
  }
]);

let tvActiveQuestions = tvQuestionsRapido;
let tvCurrentStep = 0;
let tvAnswers = [];

window.tvOpenModal = function() {
  const modal = document.getElementById('testeVocacionalModal');
  if (modal) {
    modal.classList.add('active');
    tvResetState();
  }
};

window.tvCloseModal = function() {
  const modal = document.getElementById('testeVocacionalModal');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.tvStartQuiz = function(modo) {
  tvActiveQuestions = modo === 'personalizado' ? tvQuestionsPersonalizado : tvQuestionsRapido;

  const choiceScreen = document.getElementById('tvChoiceScreen');
  const quizScreen = document.getElementById('tvQuizScreen');
  if (choiceScreen) choiceScreen.style.display = 'none';
  if (quizScreen) quizScreen.style.display = 'block';
  tvCurrentStep = 0;
  tvAnswers = [];
  tvRenderQuestion();
};

function tvRenderQuestion() {
  const q = tvActiveQuestions[tvCurrentStep];
  const stepLabel = document.getElementById('tvStepLabel');
  const progressFill = document.getElementById('tvProgressFill');
  const questionText = document.getElementById('tvQuestionText');
  const optionsWrap = document.getElementById('tvOptionsWrap');

  if (stepLabel) stepLabel.textContent = `Pergunta ${tvCurrentStep + 1} de ${tvActiveQuestions.length}`;
  if (progressFill) progressFill.style.width = `${((tvCurrentStep + 1) / tvActiveQuestions.length) * 100}%`;
  if (questionText) questionText.textContent = q.question;

  if (optionsWrap) {
    optionsWrap.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tv-option-btn';
      btn.style.cssText = 'width:100%; padding:12px; margin-bottom:8px; background:var(--bg-inner); border:1px solid var(--border-color); color:var(--text-main); border-radius:8px; text-align:left; cursor:pointer; font-size:13px;';
      btn.textContent = opt.text;
      btn.onclick = () => tvSelectOption(opt.area);
      optionsWrap.appendChild(btn);
    });
  }
}

function tvSelectOption(area) {
  tvAnswers.push(area);
  if (tvCurrentStep < tvActiveQuestions.length - 1) {
    tvCurrentStep++;
    tvRenderQuestion();
  } else {
    tvShowResult();
  }
}

window.tvGoBack = function() {
  if (tvCurrentStep > 0) {
    tvCurrentStep--;
    tvAnswers.pop();
    tvRenderQuestion();
  } else {
    tvResetState();
  }
};

function tvShowResult() {
  const quizScreen = document.getElementById('tvQuizScreen');
  const resultScreen = document.getElementById('tvResultScreen');
  if (quizScreen) quizScreen.style.display = 'none';
  if (resultScreen) resultScreen.style.display = 'block';

  const counts = {};
  tvAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
  let topArea = 'Tecnologia';
  let maxCount = 0;
  for (const area in counts) {
    if (counts[area] > maxCount) {
      maxCount = counts[area];
      topArea = area;
    }
  }

  const titleEl = document.getElementById('tvResultTitle');
  const descEl = document.getElementById('tvResultDesc');

  const descriptions = {
    Tecnologia: "Seu perfil é analítico e voltado para inovação! Você leva jeito para desenvolvimento, engenharia de software e análise de dados.",
    Finanças: "Seu forte é organização e estratégia financeira! Você se destaca em análise de mercado, investimentos e controladoria.",
    Marketing: "Você tem um perfil criativo e comunicativo! Tem facilidade para engajar pessoas, criar marcas e planejar campanhas.",
    Empreendedorismo: "Seu espírito é de liderança! Você nasceu para identificar oportunidades, gerir negócios e liderar times."
  };

  if (titleEl) titleEl.textContent = topArea;
  if (descEl) descEl.textContent = descriptions[topArea] || descriptions.Tecnologia;
}

window.tvRetake = function() {
  tvResetState();
};

window.tvFindMentors = function() {
  tvCloseModal();
  const mentorSection = document.querySelector('.mentors-section');
  if (mentorSection) {
    mentorSection.scrollIntoView({ behavior: 'smooth' });
  }
};

function tvResetState() {
  const choiceScreen = document.getElementById('tvChoiceScreen');
  const quizScreen = document.getElementById('tvQuizScreen');
  const resultScreen = document.getElementById('tvResultScreen');
  if (choiceScreen) choiceScreen.style.display = 'block';
  if (quizScreen) quizScreen.style.display = 'none';
  if (resultScreen) resultScreen.style.display = 'none';
  tvActiveQuestions = tvQuestionsRapido;
  tvCurrentStep = 0;
  tvAnswers = [];
}