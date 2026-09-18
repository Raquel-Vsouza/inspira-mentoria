/* =========================================
   1. REGISTRO DE EVENTOS E FUNÇÕES GLOBAIS
   ========================================= */

// Variável Global de Estado de Edição
window.isEditingProfile = false;

// Função para abrir o modal de perfil
window.openUserProfileModal = function() {
  const modal = document.getElementById('userProfileModal');
  if (modal) {
    modal.classList.add('active');
  }
};

// Função para fechar o modal de perfil
window.closeUserProfileModal = function() {
  if (window.isEditingProfile) {
    window.exitEditMode(false);
  }
  const modal = document.getElementById('userProfileModal');
  if (modal) {
    modal.classList.remove('active');
  }
};

// Clique no botão Editar Perfil / Salvar Alterações
window.handleProfileEditClick = function() {
  if (!window.isEditingProfile) {
    window.enterEditMode();
  } else {
    window.saveProfileData();
    window.exitEditMode(true);
  }
};

// Clique no botão Sair / Cancelar
window.handleProfileCancelClick = function() {
  if (window.isEditingProfile) {
    window.exitEditMode(false);
  } else {
    window.closeUserProfileModal();
  }
};

// Entrar no modo de edição
window.enterEditMode = function() {
  window.isEditingProfile = true;
  document.body.classList.add('is-editing-profile');

  const btnEdit = document.getElementById('btnEditProfile');
  const btnCancel = document.getElementById('btnCancelEdit');

  if (btnEdit) btnEdit.textContent = 'Salvar Alterações';
  if (btnCancel) btnCancel.textContent = 'Cancelar';
};

// Sair do modo de edição
window.exitEditMode = function(saved) {
  window.isEditingProfile = false;
  document.body.classList.remove('is-editing-profile');

  const btnEdit = document.getElementById('btnEditProfile');
  const btnCancel = document.getElementById('btnCancelEdit');

  if (btnEdit) btnEdit.textContent = 'Editar Perfil';
  if (btnCancel) btnCancel.textContent = 'Sair';
};

// Salvar os dados editados
window.saveProfileData = function() {
  const nameInput = document.getElementById('editNameInput');
  const ageInput = document.getElementById('editAgeInput');
  const emailInput = document.getElementById('editEmailInput');
  const courseInput = document.getElementById('editCourseInput');

  const newName = nameInput ? nameInput.value.trim() : '';
  const newAge = ageInput ? ageInput.value.trim() : '';
  const newEmail = emailInput ? emailInput.value.trim() : '';
  const newCourse = courseInput ? courseInput.value.trim() : '';

  // Atualiza Nome e Avatar (Header + Modal)
  if (newName) {
    const nameDisplay = document.getElementById('profileNameDisplay');
    const headerName = document.getElementById('headerUserName');

    if (nameDisplay) nameDisplay.textContent = newName;
    if (headerName) headerName.textContent = newName;

    // Iniciais do Avatar (Ex: Raquel Vitória -> RV)
    const parts = newName.split(' ').filter(p => p.length > 0);
    let initials = '';
    if (parts.length === 1) {
      initials = parts[0].substring(0, 2).toUpperCase();
    } else if (parts.length > 1) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    if (initials) {
      const modalAvatar = document.getElementById('profileAvatarDisplay');
      const headerAvatar = document.getElementById('headerUserAvatar');

      if (modalAvatar) modalAvatar.textContent = initials;
      if (headerAvatar) headerAvatar.textContent = initials;
    }
  }

  // Atualiza Idade
  if (newAge) {
    const ageDisplay = document.getElementById('profileAgeDisplay');
    if (ageDisplay) ageDisplay.textContent = newAge.includes('ano') ? newAge : `${newAge} anos`;
  }

  // Atualiza Email
  if (newEmail) {
    const emailDisplay = document.getElementById('profileEmailDisplay');
    if (emailDisplay) emailDisplay.textContent = newEmail;
  }

  // Atualiza Curso
  if (newCourse) {
    const courseDisplay = document.getElementById('profileCourseDisplay');
    if (courseDisplay) courseDisplay.textContent = newCourse;
  }
};

/* =========================================
   2. INICIALIZAÇÃO AO CARREGAR A PÁGINA
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

  // Modal de Calendário
  const openCalendarBtn = document.getElementById('openCalendarBtn');
  const calendarModal = document.getElementById('calendarModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const confirmBookingBtn = document.getElementById('confirmBookingBtn');
  const slots = document.querySelectorAll('.time-slot');
  let chosenSlot = "15 Mai - 16:00";

  if (openCalendarBtn && calendarModal) {
    openCalendarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calendarModal.classList.add('active');
    });
  }

  if (closeModalBtn && calendarModal) {
    closeModalBtn.addEventListener('click', () => {
      calendarModal.classList.remove('active');
    });
  }

  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      slots.forEach(s => s.classList.remove('active-slot'));
      slot.classList.add('active-slot');
      chosenSlot = slot.getAttribute('data-time');
    });
  });

  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      const select = document.getElementById('mentorSelect');
      const mentor = select ? select.options[select.selectedIndex].text.split('—')[0].trim() : 'Mentor';
      alert(`Mentoria agendada com sucesso!\n\nProfissional: ${mentor}\nHorário: ${chosenSlot}`);
      if (calendarModal) calendarModal.classList.remove('active');
    });
  }
});