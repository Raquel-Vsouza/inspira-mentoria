// ===================================================================
// Inspira — encontre-um-mentor.html
// Busca, filtros, ordenação, modais de agendamento/perfil e chatbot
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------------------------
  // BUSCA + FILTROS + ORDENAÇÃO
  // -----------------------------------------------------------------
  const pills = document.querySelectorAll('.filter-pill');
  const grid = document.getElementById('mentorGrid');
  const cards = Array.from(document.querySelectorAll('.card'));
  const searchInput = document.getElementById('searchInput');
  const noResults = document.getElementById('noResults');
  const sortSelect = document.getElementById('sortSelect');

  function normalize(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function applyFilters() {
    const activePill = document.querySelector('.filter-pill.active');
    const activeFilter = activePill ? activePill.dataset.filter : 'todos';
    const query = normalize(searchInput ? searchInput.value.trim() : '');
    let visibleCount = 0;

    cards.forEach(card => {
      const matchesCategory = activeFilter === 'todos' || card.dataset.category === activeFilter;
      const name = normalize(card.dataset.name || card.querySelector('.card-name')?.textContent);
      const role = normalize(card.dataset.role || card.querySelector('.card-role')?.textContent);
      const desc = normalize(card.querySelector('.card-desc')?.textContent);
      const matchesQuery = query === '' || name.includes(query) || role.includes(query) || desc.includes(query);

      const isVisible = matchesCategory && matchesQuery;
      card.style.display = isVisible ? 'flex' : 'none';
      if (isVisible) visibleCount++;
    });

    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    return visibleCount;
  }

  function applySort() {
    if (!sortSelect || !grid) return;
    const mode = sortSelect.value;
    const sorted = cards.slice().sort((a, b) => {
      if (mode === 'avaliacao') return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
      if (mode === 'mentorias') return parseInt(b.dataset.mentorias, 10) - parseInt(a.dataset.mentorias, 10);
      if (mode === 'nome') return (a.dataset.name || '').localeCompare(b.dataset.name || '');
      return 0; // "relevantes" mantém a ordem original
    });
    sorted.forEach(card => grid.appendChild(card));
  }

  function refresh() {
    applyFilters();
    applySort();
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelector('.filter-pill.active')?.classList.remove('active');
      pill.classList.add('active');
      refresh();
    });
  });

  if (searchInput) searchInput.addEventListener('input', refresh);
  if (sortSelect) sortSelect.addEventListener('change', refresh);

  // Expõe para o bot poder filtrar por área ao conversar
  window.__inspiraSetFilter = function (filterValue) {
    const target = document.querySelector(`.filter-pill[data-filter="${filterValue}"]`);
    if (target) target.click();
  };
  window.__inspiraClearSearch = function () {
    if (searchInput) { searchInput.value = ''; }
  };
  window.__inspiraSearch = function (term) {
    if (searchInput) { searchInput.value = term; refresh(); }
  };

  refresh();

  // -----------------------------------------------------------------
  // TEMA (claro/escuro)
  // -----------------------------------------------------------------
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      document.body.classList.toggle('dark-mode');
    });
  }

  // -----------------------------------------------------------------
  // MODAL DE AGENDAMENTO
  // -----------------------------------------------------------------
  const scheduleModal = document.getElementById('scheduleModal');
  const modalScheduleView = document.getElementById('modalScheduleView');
  const modalSuccessView = document.getElementById('modalSuccessView');
  const modalAvatar = document.getElementById('modalAvatar');
  const modalName = document.getElementById('modalName');
  const modalRole = document.getElementById('modalRole');
  const modalDays = document.getElementById('modalDays');
  const modalSlots = document.getElementById('modalSlots');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const successDetail = document.getElementById('successDetail');

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  let chosenDayLabel = null;
  let chosenSlot = null;
  let chosenMentorName = null;

  function buildNextDays(n) {
    const out = [];
    const today = new Date();
    for (let i = 0; i < n; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push(d);
    }
    return out;
  }

  function openScheduleModal(card) {
    if (!scheduleModal) return;
    chosenDayLabel = null;
    chosenSlot = null;
    chosenMentorName = card.dataset.name || card.querySelector('.card-name')?.textContent || '';

    if (modalAvatar) modalAvatar.textContent = card.dataset.initials || chosenMentorName.slice(0, 2).toUpperCase();
    if (modalName) modalName.textContent = chosenMentorName;
    if (modalRole) modalRole.textContent = card.dataset.role || card.querySelector('.card-role')?.textContent || '';

    if (modalDays) {
      modalDays.innerHTML = '';
      buildNextDays(6).forEach((d, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'modal-day-pill';
        btn.textContent = `${diasSemana[d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]}`;
        btn.addEventListener('click', () => {
          modalDays.querySelectorAll('.modal-day-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          chosenDayLabel = btn.textContent;
          chosenSlot = null;
          renderSlots(idx === 0);
        });
        modalDays.appendChild(btn);
      });
    }

    if (modalSlots) {
      modalSlots.innerHTML = '<span class="slots-empty-hint">Escolha um dia para ver os horários disponíveis.</span>';
    }
    if (modalConfirmBtn) modalConfirmBtn.disabled = true;

    if (modalSuccessView) modalSuccessView.style.display = 'none';
    if (modalScheduleView) modalScheduleView.style.display = 'block';
    scheduleModal.classList.add('open');
    scheduleModal.style.display = 'flex';
  }

  function renderSlots(isToday) {
    if (!modalSlots) return;
    const allSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const hourNow = new Date().getHours();
    const slots = isToday ? allSlots.filter(s => parseInt(s, 10) > hourNow) : allSlots;

    modalSlots.innerHTML = '';
    if (slots.length === 0) {
      modalSlots.innerHTML = '<span class="slots-empty-hint">Sem horários livres nesse dia. Escolha outro dia.</span>';
      return;
    }
    slots.forEach(s => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'modal-slot-pill';
      btn.textContent = s;
      btn.addEventListener('click', () => {
        modalSlots.querySelectorAll('.modal-slot-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        chosenSlot = s;
        if (modalConfirmBtn) modalConfirmBtn.disabled = false;
      });
      modalSlots.appendChild(btn);
    });
  }

  function closeScheduleModal() {
    if (!scheduleModal) return;
    scheduleModal.classList.remove('open');
    scheduleModal.style.display = 'none';
  }

  document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('click', () => openScheduleModal(btn.closest('.card')));
  });

  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeScheduleModal);

  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => {
      if (!chosenDayLabel || !chosenSlot) return;
      if (successDetail) successDetail.textContent = `Com ${chosenMentorName} — ${chosenDayLabel} às ${chosenSlot}`;
      if (modalScheduleView) modalScheduleView.style.display = 'none';
      if (modalSuccessView) modalSuccessView.style.display = 'block';
      chatBotSay(`Prontinho! Sua mentoria com ${chosenMentorName} ficou marcada para ${chosenDayLabel} às ${chosenSlot}. Te mandei os detalhes por e-mail. 🎉`);
    });
  }

  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeScheduleModal);

  if (scheduleModal) {
    scheduleModal.addEventListener('click', (e) => {
      if (e.target === scheduleModal) closeScheduleModal();
    });
  }

  // -----------------------------------------------------------------
  // MODAL DE PERFIL DO USUÁRIO
  // -----------------------------------------------------------------
  const userProfileModal = document.getElementById('userProfileModal');
  const profileModalClose = document.getElementById('profileModalClose');
  const profileViewMode = document.getElementById('profileViewMode');
  const profileEditMode = document.getElementById('profileEditMode');
  const editProfileBtn = document.getElementById('editProfileBtn');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const cancelProfileBtn = document.getElementById('cancelProfileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  const profileNameView = document.getElementById('profileNameView');
  const profileEmailView = document.getElementById('profileEmailView');
  const profileCourseView = document.getElementById('profileCourseView');
  const profileAvatarView = document.getElementById('profileAvatarView');
  const profileAvatarEdit = document.getElementById('profileAvatarEdit');

  const profileNameInput = document.getElementById('profileNameInput');
  const profileEmailInput = document.getElementById('profileEmailInput');
  const profileCourseInput = document.getElementById('profileCourseInput');

  const headerUserAvatar = document.getElementById('headerUserAvatar');
  const headerUserName = document.querySelector('.user-name');

  window.openUserProfileModal = function () {
    if (!userProfileModal) return;
    if (profileViewMode) profileViewMode.style.display = 'block';
    if (profileEditMode) profileEditMode.style.display = 'none';
    userProfileModal.classList.add('open');
    userProfileModal.style.display = 'flex';
  };

  function closeUserProfileModal() {
    if (!userProfileModal) return;
    userProfileModal.classList.remove('open');
    userProfileModal.style.display = 'none';
  }

  if (profileModalClose) profileModalClose.addEventListener('click', closeUserProfileModal);
  if (userProfileModal) {
    userProfileModal.addEventListener('click', (e) => {
      if (e.target === userProfileModal) closeUserProfileModal();
    });
  }

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      if (profileNameInput) profileNameInput.value = profileNameView?.textContent.trim() || '';
      if (profileEmailInput) profileEmailInput.value = profileEmailView?.textContent.trim() || '';
      if (profileCourseInput) profileCourseInput.value = profileCourseView?.textContent.trim() || '';
      if (profileViewMode) profileViewMode.style.display = 'none';
      if (profileEditMode) profileEditMode.style.display = 'block';
    });
  }

  if (cancelProfileBtn) {
    cancelProfileBtn.addEventListener('click', () => {
      if (profileEditMode) profileEditMode.style.display = 'none';
      if (profileViewMode) profileViewMode.style.display = 'block';
    });
  }

  function initialsOf(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
      const newName = profileNameInput?.value.trim() || '';
      const newEmail = profileEmailInput?.value.trim() || '';
      const newCourse = profileCourseInput?.value.trim() || '';
      const ini = initialsOf(newName || 'Você');

      if (profileNameView) profileNameView.textContent = newName;
      if (profileEmailView) profileEmailView.textContent = newEmail;
      if (profileCourseView) profileCourseView.textContent = newCourse;
      if (profileAvatarView) profileAvatarView.textContent = ini;
      if (profileAvatarEdit) profileAvatarEdit.textContent = ini;
      if (headerUserAvatar) headerUserAvatar.textContent = ini;
      if (headerUserName) headerUserName.textContent = newName;

      if (profileEditMode) profileEditMode.style.display = 'none';
      if (profileViewMode) profileViewMode.style.display = 'block';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      closeUserProfileModal();
      chatBotSay('Você saiu da sua conta. Até a próxima! 👋');
    });
  }

  // -----------------------------------------------------------------
  // CHATBOT — abrir/fechar, enviar mensagens, respostas
  // -----------------------------------------------------------------
  const iwPanel = document.getElementById('iwPanel');
  const iwBody = document.getElementById('iwBody');
  const iwInput = document.getElementById('iwInput');

  window.toggleChatWidget = function () {
    if (!iwPanel) return;
    const isOpen = iwPanel.classList.toggle('open');
    iwPanel.style.display = isOpen ? 'flex' : 'none';
    if (isOpen && iwInput) iwInput.focus();
    if (!isOpen) endVideoCall();
  };

  function chatBotSay(text) {
    if (!iwBody) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    bubble.textContent = text;
    iwBody.appendChild(bubble);
    iwBody.scrollTop = iwBody.scrollHeight;
  }

  function chatUserSay(text) {
    if (!iwBody) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.textContent = text;
    iwBody.appendChild(bubble);
    iwBody.scrollTop = iwBody.scrollHeight;
  }

  function typingIndicator(show) {
    let ind = document.getElementById('iwTypingIndicator');
    if (show) {
      if (!ind && iwBody) {
        ind = document.createElement('div');
        ind.id = 'iwTypingIndicator';
        ind.className = 'chat-bubble bot';
        ind.textContent = '...';
        iwBody.appendChild(ind);
        iwBody.scrollTop = iwBody.scrollHeight;
      }
    } else if (ind) {
      ind.remove();
    }
  }

  const CATEGORY_KEYWORDS = {
    tecnologia: ['tecnologia', 'tech', 'cloud', 'nuvem', 'dados', 'dev', 'programa', 'ti ', 'engenharia', 'software', 'machine learning', 'ml'],
    financas: ['financ', 'dinheiro', 'investim', 'cfo', 'carreira financeira'],
    empreendedorismo: ['empreende', 'startup', 'investidor', 'negóc', 'negoc', 'fundador', 'fundadora', 'abrir empresa'],
    marketing: ['marketing', 'tráfego', 'trafego', 'divulga', 'marca', 'growth']
  };

  const MENTOR_NAMES = Array.from(cards).map(c => c.dataset.name).filter(Boolean);

  function findCategoryInText(text) {
    for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
      if (words.some(w => text.includes(w))) return cat;
    }
    return null;
  }

  function findMentorInText(text) {
    return MENTOR_NAMES.find(name => text.includes(normalize(name.split(' ')[0])));
  }

  function respondTo(rawText) {
    const text = normalize(rawText);

    if (/\b(oi|ola|olá|bom dia|boa tarde|boa noite|e ai|eai)\b/.test(text)) {
      return 'Oi! 😊 Me conta o que você está buscando — uma área (tecnologia, finanças, empreendedorismo, marketing) ou o nome de um mentor — que eu já filtro pra você.';
    }

    const mentorHit = findMentorInText(text);
    if (mentorHit) {
      const card = Array.from(cards).find(c => c.dataset.name === mentorHit);
      window.__inspiraClearSearch();
      window.__inspiraSetFilter('todos');
      window.__inspiraSearch(mentorHit);
      const role = card?.querySelector('.card-role')?.textContent || '';
      const rating = card?.dataset.rating || '';
      return `${mentorHit} (${role}) tem nota ${rating}. Já deixei o card em destaque na lista — clique em "Agendar mentoria" para marcar um horário.`;
    }

    const cat = findCategoryInText(text);
    if (cat) {
      window.__inspiraClearSearch();
      window.__inspiraSetFilter(cat);
      const labels = {
        tecnologia: 'Tecnologia & Cloud',
        financas: 'Finanças',
        empreendedorismo: 'Empreendedorismo',
        marketing: 'Marketing'
      };
      return `Boa! Filtrei os mentores de ${labels[cat]} para você. Dá uma olhada nos cards e clique em "Agendar mentoria" quando encontrar o ideal.`;
    }

    if (/\b(agendar|marcar|horario|horário|reuniao|reunião)\b/.test(text)) {
      return 'Para agendar, escolha um mentor na lista e clique em "Agendar mentoria" no card dele — você vai poder escolher o dia e o horário.';
    }

    if (/\b(gratis|grátis|gratuito|preco|preço|pagar|valor)\b/.test(text)) {
      return 'Boa notícia: todas as mentorias aqui na Inspira são gratuitas! 🎉';
    }

    if (/\b(obrigad|valeu|show|top)\b/.test(text)) {
      return 'Disponha! Se precisar de mais alguma coisa, é só chamar. 🙌';
    }

    return 'Posso te ajudar a achar um mentor por área (tecnologia, finanças, empreendedorismo ou marketing) ou pelo nome. O que você procura?';
  }

  window.iwSendFromInput = function () {
    if (!iwInput) return;
    const text = iwInput.value.trim();
    if (!text) return;
    chatUserSay(text);
    iwInput.value = '';
    typingIndicator(true);
    setTimeout(() => {
      typingIndicator(false);
      chatBotSay(respondTo(text));
    }, 650 + Math.random() * 500);
  };

  window.iwHandleInputKey = function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      window.iwSendFromInput();
    }
  };

  // -----------------------------------------------------------------
  // CHAMADA DE VÍDEO (webcam real, com simulação de reserva)
  // -----------------------------------------------------------------
  let videoStream = null;
  let simulationInterval = null;
  let simulationCanvas = null;

  window.toggleVideoCall = function () {
    if (!iwPanel) return;
    if (!iwPanel.classList.contains('open')) {
      iwPanel.classList.add('open');
      iwPanel.style.display = 'flex';
    }

    const videoArea = document.getElementById('chatVideoArea');
    const videoEl = document.getElementById('chatVideoPreview');
    if (!videoArea || !videoEl) return;

    // Se já está em chamada, encerra
    if (videoArea.style.display === 'block') {
      endVideoCall();
      return;
    }

    videoArea.style.display = 'block';
    chatBotSay('Iniciando a câmera para a chamada de vídeo...');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          videoStream = stream;
          videoEl.style.display = 'block';
          videoEl.srcObject = stream;
          if (simulationCanvas) { simulationCanvas.style.display = 'none'; }
          chatBotSay('Câmera conectada! Assim que um mentor entrar, a chamada começa por aqui.');
        })
        .catch(() => {
          startSimulation(videoArea, videoEl);
          chatBotSay('Não consegui acessar sua câmera (permissão negada ou indisponível). Deixei uma prévia simulada no lugar — você pode liberar o acesso à câmera do navegador e tentar de novo.');
        });
    } else {
      startSimulation(videoArea, videoEl);
      chatBotSay('Seu navegador não suporta acesso à câmera. Deixei uma prévia simulada no lugar.');
    }
  };

  function startSimulation(container, videoEl) {
    videoEl.style.display = 'none';
    if (!simulationCanvas) {
      simulationCanvas = document.createElement('canvas');
      simulationCanvas.width = 320;
      simulationCanvas.height = 160;
      simulationCanvas.style.width = '100%';
      simulationCanvas.style.borderRadius = '10px';
      simulationCanvas.style.background = '#000';
      container.insertBefore(simulationCanvas, videoEl);
    }
    simulationCanvas.style.display = 'block';
    const ctx = simulationCanvas.getContext('2d');
    let x = 0;
    if (simulationInterval) clearInterval(simulationInterval);
    simulationInterval = setInterval(() => {
      ctx.fillStyle = '#1c2333';
      ctx.fillRect(0, 0, simulationCanvas.width, simulationCanvas.height);
      ctx.fillStyle = '#DDAA55';
      ctx.beginPath();
      ctx.arc(simulationCanvas.width / 2 + Math.sin(x) * 50, simulationCanvas.height / 2 - 10, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '13px Segoe UI, Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Câmera (modo simulação)', simulationCanvas.width / 2, simulationCanvas.height / 2 + 45);
      x += 0.1;
    }, 50);
  }

  window.endVideoCall = function () {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      videoStream = null;
    }
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
    }
    if (simulationCanvas) simulationCanvas.style.display = 'none';

    const videoArea = document.getElementById('chatVideoArea');
    const videoEl = document.getElementById('chatVideoPreview');
    if (videoArea) videoArea.style.display = 'none';
    if (videoEl) { videoEl.srcObject = null; videoEl.style.display = 'block'; }
  };

});