/* ===================================================
   PÁGINA DE RECURSOS - Lógica funcional
   (busca, filtros por categoria, modal Analisador ATS)
   =================================================== */

(function () {

  /* ---------- BUSCA + FILTROS POR CATEGORIA ---------- */

  function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const term = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const activePill = document.querySelector('.recursos-filter-pill.active');
    const category = activePill ? activePill.dataset.category : 'todos';

    const cards = document.querySelectorAll('.resource-card');
    let visibleCount = 0;

    cards.forEach(function (card) {
      const title = (card.querySelector('.resource-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.resource-desc')?.textContent || '').toLowerCase();
      const tag = (card.querySelector('.resource-tag')?.textContent || '').toLowerCase();

      const matchesSearch = !term || title.includes(term) || desc.includes(term) || tag.includes(term);
      const matchesCategory = category === 'todos' || card.dataset.category === category;

      const visible = matchesSearch && matchesCategory;
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });

    toggleEmptyState(visibleCount);
  }

  function toggleEmptyState(visibleCount) {
    const grid = document.querySelector('.recursos-grid');
    if (!grid) return;

    let emptyMsg = document.getElementById('recursosEmptyState');
    if (visibleCount === 0) {
      if (!emptyMsg) {
        emptyMsg = document.createElement('p');
        emptyMsg.id = 'recursosEmptyState';
        emptyMsg.style.cssText = 'grid-column: 1 / -1; text-align:center; color:#9ca3af; padding: 40px 0; font-size:14px;';
        emptyMsg.textContent = 'Nenhum recurso encontrado para essa busca/filtro.';
        grid.appendChild(emptyMsg);
      }
    } else if (emptyMsg) {
      emptyMsg.remove();
    }
  }

  function setupFilterPills() {
    const pills = document.querySelectorAll('.recursos-filter-pill');
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        applyFilters();
      });
    });
  }

  function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
  }

  /* ---------- BOTÕES DE AÇÃO DOS CARDS (sem ATS) ---------- */

  function setupResourceButtons() {
    document.querySelectorAll('.resource-card .btn-download:not(.btn-ats-action)').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const card = btn.closest('.resource-card');
        const title = card ? card.querySelector('.resource-title')?.textContent : 'recurso';
        alert('Abrindo "' + title + '"... Em breve esse conteúdo estará disponível diretamente na plataforma.');
      });
    });
  }

  /* ---------- MODAL ANALISADOR ATS ---------- */

  const KEYWORD_BANK = [
    'gestão de projetos', 'gestao de projetos', 'metodologias ágeis', 'metodologias ageis',
    'scrum', 'kanban', 'power bi', 'sql', 'aws', 'cloud', 'python', 'excel',
    'análise de dados', 'analise de dados', 'liderança', 'lideranca', 'comunicação',
    'comunicacao', 'jira', 'trello', 'análise e desenvolvimento de sistemas'
  ];

  function normalize(text) {
    return (text || '').toLowerCase();
  }

  function setupAtsFileInput() {
    const fileInput = document.getElementById('atsResumeFile');
    const fileNameLabel = document.getElementById('atsFileName');
    if (!fileInput || !fileNameLabel) return;

    fileInput.addEventListener('change', function () {
      const file = fileInput.files && fileInput.files[0];
      if (!file) {
        fileNameLabel.textContent = 'Nenhum arquivo selecionado';
        fileNameLabel.style.color = '';
        return;
      }
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        alert('Por favor, selecione um arquivo em PDF.');
        fileInput.value = '';
        fileNameLabel.textContent = 'Nenhum arquivo selecionado';
        fileNameLabel.style.color = '';
        return;
      }
      fileNameLabel.textContent = file.name;
      fileNameLabel.style.color = '#DDAA55';
    });
  }

  function resetAtsFileInput() {
    const fileInput = document.getElementById('atsResumeFile');
    const fileNameLabel = document.getElementById('atsFileName');
    if (fileInput) fileInput.value = '';
    if (fileNameLabel) {
      fileNameLabel.textContent = 'Nenhum arquivo selecionado';
      fileNameLabel.style.color = '';
    }
  }

  window.openAtsModal = function () {
    try {
      const modal = document.getElementById('atsModal');
      if (!modal) {
        alert('ERRO DE DIAGNÓSTICO: não encontrei nenhum elemento com id="atsModal" nesta página.');
        return;
      }
      const step1 = document.getElementById('atsStep1');
      const step2 = document.getElementById('atsStep2');
      if (!step1 || !step2) {
        alert('ERRO DE DIAGNÓSTICO: não encontrei atsStep1 e/ou atsStep2 dentro do modal.');
        return;
      }
      step1.style.display = '';
      step2.style.display = 'none';
      modal.style.display = 'flex';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } catch (err) {
      alert('ERRO DE DIAGNÓSTICO ao abrir o modal ATS: ' + err.message);
    }
  };

  window.closeAtsModal = function () {
    const modal = document.getElementById('atsModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  window.resetAtsAnalysis = function () {
    document.getElementById('atsStep1').style.display = '';
    document.getElementById('atsStep2').style.display = 'none';
    resetAtsFileInput();
  };

  window.runAtsAnalysis = function () {
    const jobInput = document.getElementById('atsTargetJob');
    const resumeInput = document.getElementById('atsResumeText');

    const job = jobInput ? jobInput.value.trim() : '';
    const resume = resumeInput ? resumeInput.value.trim() : '';

    if (!resume) {
      alert('Cole o texto do seu currículo antes de executar a varredura.');
      resumeInput && resumeInput.focus();
      return;
    }

    const resumeNorm = normalize(resume);
    const jobNorm = normalize(job);

    const found = KEYWORD_BANK.filter(function (kw) { return resumeNorm.includes(kw); });
    const uniqueFound = Array.from(new Set(found.map(function (k) {
      // evita duplicar "gestão"/"gestao" e "ágeis"/"ageis" no resultado exibido
      return k.replace('gestao', 'gestão').replace('ageis', 'ágeis')
              .replace('lideranca', 'liderança').replace('comunicacao', 'comunicação')
              .replace('analise', 'análise');
    })));
    const dedupFound = Array.from(new Set(uniqueFound));

    // Score: base pelas keywords encontradas + bônus se a vaga alvo aparece refletida no texto
    let score = Math.round((dedupFound.length / 8) * 100);
    if (jobNorm && resumeNorm.length > 0) {
      const jobWords = jobNorm.split(/\s+/).filter(function (w) { return w.length > 3; });
      const jobHits = jobWords.filter(function (w) { return resumeNorm.includes(w); }).length;
      score += jobHits * 3;
    }
    score = Math.max(35, Math.min(98, score));

    const matchLabel = score >= 85 ? 'Excelente Match' : score >= 65 ? 'Bom Match' : 'Precisa Melhorar';
    const matchColor = score >= 85 ? '#10b981' : score >= 65 ? '#DDAA55' : '#ef4444';

    const suggestions = [];
    if (!resumeNorm.match(/\d+%|\d+ (projetos|clientes|usuários|usuarios|equipe)/)) {
      suggestions.push('Adicionar métricas quantificáveis de impacto nas entregas anteriores (ex: "reduziu X% do tempo de entrega").');
    }
    if (!resumeNorm.includes('jira') && !resumeNorm.includes('trello')) {
      suggestions.push('Enfatizar termos específicos de ferramentas de gestão como Jira ou Trello, se aplicável.');
    }
    if (job && !resumeNorm.includes(jobNorm.split(' ')[0])) {
      suggestions.push('Alinhar o resumo profissional com termos usados na descrição da vaga "' + job + '".');
    }
    if (suggestions.length === 0) {
      suggestions.push('Seu currículo já está bem alinhado — considere adicionar 1-2 conquistas específicas para reforçar ainda mais.');
    }

    document.querySelector('#atsStep2 div[style*="font-size: 28px"]').textContent = score + '%';
    const matchBadge = document.querySelector('#atsStep2 span[style*="background: #10b981"]');
    matchBadge.textContent = matchLabel;
    matchBadge.style.background = matchColor;

    const keywordsBox = document.querySelector('#atsStep2 p[style*="color: #10b981"]');
    keywordsBox.textContent = dedupFound.length ? dedupFound.map(capitalize).join(', ') : 'Nenhuma palavra-chave relevante detectada.';

    const suggestionsList = document.querySelector('#atsStep2 ul');
    suggestionsList.innerHTML = suggestions.map(function (s) { return '<li>' + s + '</li>'; }).join('');

    document.getElementById('atsStep1').style.display = 'none';
    document.getElementById('atsStep2').style.display = '';
  };

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* ---------- INIT ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    setupSearch();
    setupFilterPills();
    setupResourceButtons();
    setupAtsFileInput();

    const atsModal = document.getElementById('atsModal');
    if (atsModal) {
      atsModal.addEventListener('click', function (e) {
        if (e.target === atsModal) window.closeAtsModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && atsModal && atsModal.style.display === 'flex') {
        window.closeAtsModal();
      }
    });
  });

})();

/* ===================================================
   PERFIL DO USUÁRIO - Modal funcional
   (embutido aqui para garantir que rode nesta página,
   independente do conteúdo de js/script.js)
   =================================================== */

(function () {

  function getInitials(fullName) {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function loadProfileData() {
    const defaults = {
      name: 'Raquel Vitória de Souza',
      email: 'raquel.vitoria@exemplo.com',
      course: 'Análise e Desenvolvimento de Sistemas'
    };
    try {
      const saved = localStorage.getItem('inspiraUserProfile');
      if (saved) return Object.assign({}, defaults, JSON.parse(saved));
    } catch (e) {
      console.warn('Não foi possível carregar o perfil salvo:', e);
    }
    return defaults;
  }

  function saveProfileData(data) {
    try {
      localStorage.setItem('inspiraUserProfile', JSON.stringify(data));
    } catch (e) {
      console.warn('Não foi possível salvar o perfil:', e);
    }
  }

  function applyProfileToDOM(data) {
    const initials = getInitials(data.name);

    const headerName = document.querySelector('.dash-user-profile .user-name');
    const headerAvatar = document.getElementById('headerUserAvatar');
    if (headerName) headerName.textContent = data.name;
    if (headerAvatar) headerAvatar.textContent = initials;

    const nameView = document.getElementById('profileNameView');
    const emailView = document.getElementById('profileEmailView');
    const courseView = document.getElementById('profileCourseView');
    const avatarView = document.getElementById('profileAvatarView');
    if (nameView) nameView.textContent = data.name;
    if (emailView) emailView.textContent = data.email;
    if (courseView) courseView.textContent = data.course;
    if (avatarView) avatarView.textContent = initials;

    const nameInput = document.getElementById('profileNameInput');
    const emailInput = document.getElementById('profileEmailInput');
    const courseInput = document.getElementById('profileCourseInput');
    const avatarEdit = document.getElementById('profileAvatarEdit');
    if (nameInput) nameInput.value = data.name;
    if (emailInput) emailInput.value = data.email;
    if (courseInput) courseInput.value = data.course;
    if (avatarEdit) avatarEdit.textContent = initials;
  }

  let currentProfile = loadProfileData();

  function showViewMode() {
    const viewMode = document.getElementById('profileViewMode');
    const editMode = document.getElementById('profileEditMode');
    if (viewMode) viewMode.style.display = '';
    if (editMode) editMode.style.display = 'none';
  }

  function showEditMode() {
    const viewMode = document.getElementById('profileViewMode');
    const editMode = document.getElementById('profileEditMode');
    if (viewMode) viewMode.style.display = 'none';
    if (editMode) editMode.style.display = '';
    applyProfileToDOM(currentProfile);
  }

  window.openUserProfileModal = function () {
    const modal = document.getElementById('userProfileModal');
    if (!modal) return;
    applyProfileToDOM(currentProfile);
    showViewMode();
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeUserProfileModal = function () {
    const modal = document.getElementById('userProfileModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    showViewMode();
  };

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function saveProfile() {
    const nameInput = document.getElementById('profileNameInput');
    const emailInput = document.getElementById('profileEmailInput');
    const courseInput = document.getElementById('profileCourseInput');

    const name = (nameInput && nameInput.value.trim()) || '';
    const email = (emailInput && emailInput.value.trim()) || '';
    const course = (courseInput && courseInput.value.trim()) || '';

    if (!name) {
      alert('Por favor, informe seu nome completo.');
      nameInput && nameInput.focus();
      return;
    }
    if (!email || !isValidEmail(email)) {
      alert('Por favor, informe um e-mail válido.');
      emailInput && emailInput.focus();
      return;
    }

    currentProfile = { name, email, course };
    saveProfileData(currentProfile);
    applyProfileToDOM(currentProfile);
    showViewMode();
  }

  function cancelEdit() {
    applyProfileToDOM(currentProfile);
    showViewMode();
  }

  function logout() {
    const confirmed = confirm('Tem certeza de que deseja sair da sua conta?');
    if (confirmed) {
      try {
        localStorage.removeItem('inspiraUserProfile');
      } catch (e) { /* noop */ }
      window.location.href = 'index.html';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyProfileToDOM(currentProfile);
  });

  // Delegação de eventos no document: funciona mesmo que outro script
  // (ex: script.js) substitua/reclone os botões depois do carregamento.
  document.addEventListener('click', function (e) {
    if (e.target.closest('#profileModalClose')) {
      window.closeUserProfileModal();
      return;
    }
    if (e.target.closest('#editProfileBtn')) {
      showEditMode();
      return;
    }
    if (e.target.closest('#saveProfileBtn')) {
      saveProfile();
      return;
    }
    if (e.target.closest('#cancelProfileBtn')) {
      cancelEdit();
      return;
    }
    if (e.target.closest('#logoutBtn')) {
      logout();
      return;
    }
    if (e.target.id === 'userProfileModal') {
      window.closeUserProfileModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    const modalOverlay = document.getElementById('userProfileModal');
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      window.closeUserProfileModal();
    }
  });

})();