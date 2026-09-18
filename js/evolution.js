/* Lógica do  Perfil e Plano de Evolução Dinâmico */

let isEditingProfile = false;

function openUserProfileModal() {
  document.getElementById('userProfileModal').classList.add('active');
}

function closeUserProfileModal() {
  if (isEditingProfile) {
    exitEditMode(false);
  }
  document.getElementById('userProfileModal').classList.remove('active');
}

function handleProfileEditClick() {
  if (!isEditingProfile) {
    enterEditMode();
  } else {
    saveProfileData();
    exitEditMode(true);
  }
}

function handleProfileCancelClick() {
  if (isEditingProfile) {
    exitEditMode(false);
  } else {
    closeUserProfileModal();
  }
}

function enterEditMode() {
  isEditingProfile = true;
  document.body.classList.add('is-editing-profile');
  document.getElementById('btnEditProfile').textContent = 'Salvar Alterações';
  document.getElementById('btnCancelEdit').textContent = 'Cancelar';
}

function exitEditMode(saved) {
  isEditingProfile = false;
  document.body.classList.remove('is-editing-profile');
  document.getElementById('btnEditProfile').textContent = 'Editar Perfil';
  document.getElementById('btnCancelEdit').textContent = 'Sair';

  if (!saved) {
    document.getElementById('editNameInput').value = document.getElementById('profileNameDisplay').textContent.trim();
    document.getElementById('editEmailInput').value = document.getElementById('profileEmailDisplay').textContent.trim();
    document.getElementById('editCourseInput').value = document.getElementById('profileCourseDisplay').textContent.trim();
  }
}

function saveProfileData() {
  const newName = document.getElementById('editNameInput').value.trim();
  const newEmail = document.getElementById('editEmailInput').value.trim();
  const newCourse = document.getElementById('editCourseInput').value.trim();

  if (newName) {
    document.getElementById('profileNameDisplay').textContent = newName;
    const headerName = document.querySelector('.dash-header .user-name');
    if (headerName) headerName.textContent = newName;

    const parts = newName.split(' ').filter(p => p.length > 0);
    let initials = '';
    if (parts.length === 1) {
      initials = parts[0].substring(0, 2).toUpperCase();
    } else if (parts.length > 1) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    if (initials) {
      document.getElementById('profileAvatarDisplay').textContent = initials;
      const headerAvatar = document.querySelector('.dash-header .user-avatar');
      if (headerAvatar) headerAvatar.textContent = initials;
    }
  }

  if (newEmail) {
    document.getElementById('profileEmailDisplay').textContent = newEmail;
  }

  if (newCourse) {
    document.getElementById('profileCourseDisplay').textContent = newCourse;
  }
}

/* ESTADO E LÓGICA DO PLANO DE EVOLUÇÃO */
let evolutionSteps = [
  { title: "Realizar o Teste Vocacional", desc: "Identificou afinidade com Tecnologia e Sistemas", completed: false },
  { title: "Completar o Perfil Profissional", desc: "Informações de curso e objetivos atualizadas", completed: false },
  { title: "Primeira Sessão de Mentoria", desc: "Alinhamento inicial com liderança em Tech", completed: false },
  { title: "Participar da Mentoria com Carlos Almeida", desc: "Agendado para 15 de Maio, às 16:00", completed: false },
  { title: "Entrega do Projeto Prático / Portfólio", desc: "Consolidação dos aprendizados da trilha", completed: false }
];

function openEvolutionModal() {
  document.getElementById('evolutionPlanModal').classList.add('active');
  renderEvolutionModal();
}

function closeEvolutionModal() {
  document.getElementById('evolutionPlanModal').classList.remove('active');
}

function renderEvolutionModal() {
  const container = document.getElementById('evolutionStepsList');
  if (!container) return;

  const completedCount = evolutionSteps.filter(s => s.completed).length;
  const percentage = Math.round((completedCount / evolutionSteps.length) * 100);

  document.getElementById('evolutionPercentage').textContent = percentage + '%';

  const mainCircle = document.getElementById('mainCardProgress');
  if (mainCircle) mainCircle.textContent = percentage + '%';

  let levelText = "Nível 0 — Comece sua jornada";
  if (percentage > 0 && percentage <= 40) levelText = "Nível 1 — Iniciando a Trilha";
  else if (percentage > 40 && percentage <= 70) levelText = "Nível 2 — Em Desenvolvimento";
  else if (percentage > 70 && percentage < 100) levelText = "Nível 3 — Quase lá!";
  else if (percentage === 100) levelText = "Nível 4 — Trilha Concluída! 🎉";
  
  document.getElementById('evolutionLevelText').textContent = levelText;

  let html = '';
  evolutionSteps.forEach((step, index) => {
    const borderColor = step.completed ? '#2B625C' : '#555';
    const badgeBg = step.completed ? 'rgba(43,98,92,0.3)' : 'rgba(255,255,255,0.05)';
    const badgeColor = step.completed ? '#4ade80' : '#888';
    const badgeText = step.completed ? 'Concluído' : 'Pendente';
    const iconBg = step.completed ? '#2B625C' : '#333';
    const iconContent = step.completed ? '✓' : (index + 1);
    const titleColor = step.completed ? '#fff' : '#aaa';
    const bgAlpha = step.completed ? '0.03' : '0.02';

    html += `
      <div class="evolution-step-card" onclick="toggleEvolutionStep(${index})" style="background: rgba(255,255,255,${bgAlpha}); border-left: 4px solid ${borderColor};">
        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${iconBg}; color: ${step.completed ? '#fff' : '#888'}; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">${iconContent}</div>
        <div style="flex-grow: 1;">
          <div style="font-weight: bold; font-size: 14px; color: ${titleColor};">${step.title}</div>
          <div style="font-size: 12px; color: #aaa;">${step.desc}</div>
        </div>
        <span style="font-size: 11px; background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 10px;">${badgeText}</span>
      </div>
    `;
  });
  container.innerHTML = html;
}

function toggleEvolutionStep(index) {
  evolutionSteps[index].completed = !evolutionSteps[index].completed;
  renderEvolutionModal();
}

function resetEvolutionPlan() {
  evolutionSteps.forEach(s => s.completed = false);
  renderEvolutionModal();
}

/* CONTROLE DO MODAL DE CADASTRO DE MENTOR */

function openMentorFormModal() {
  document.getElementById('mentorFormModal').classList.add('active');
}

function closeMentorFormModal() {
  document.getElementById('mentorFormModal').classList.remove('active');
}

function handleMentorFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('mentorName').value.trim();
  
  alert(`Obrigado pelo interesse, ${name}!\n\nSua inscrição para se tornar mentor foi enviada com sucesso para nossa equipe.`);
  
  document.getElementById('mentorForm').reset();
  closeMentorFormModal();
}