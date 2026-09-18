/* ===================================================
   PERFIL DO USUÁRIO - Modal funcional
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

    // Header
    const headerName = document.querySelector('.dash-user-profile .user-name');
    const headerAvatar = document.getElementById('headerUserAvatar');
    if (headerName) headerName.textContent = data.name;
    if (headerAvatar) headerAvatar.textContent = initials;

    // Modal - view mode
    const nameView = document.getElementById('profileNameView');
    const emailView = document.getElementById('profileEmailView');
    const courseView = document.getElementById('profileCourseView');
    const avatarView = document.getElementById('profileAvatarView');
    if (nameView) nameView.textContent = data.name;
    if (emailView) emailView.textContent = data.email;
    if (courseView) courseView.textContent = data.course;
    if (avatarView) avatarView.textContent = initials;

    // Modal - edit mode
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
    // garante que os campos de edição reflitam os dados atuais
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

    const closeBtn = document.getElementById('profileModalClose');
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const cancelBtn = document.getElementById('cancelProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const modalOverlay = document.getElementById('userProfileModal');

    if (closeBtn) closeBtn.addEventListener('click', window.closeUserProfileModal);
    if (editBtn) editBtn.addEventListener('click', showEditMode);
    if (saveBtn) saveBtn.addEventListener('click', saveProfile);
    if (cancelBtn) cancelBtn.addEventListener('click', cancelEdit);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    if (modalOverlay) {
      modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
          window.closeUserProfileModal();
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        window.closeUserProfileModal();
      }
    });
  });

})();