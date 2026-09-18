const pills = document.querySelectorAll('.filter-pill');
const cards = document.querySelectorAll('.card');

pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filter = pill.dataset.filter;
    cards.forEach(card => {
      card.style.display = (filter === 'todos' || card.dataset.category === filter) ? 'flex' : 'none';
    });
  });
});

document.getElementById('mentorGrid').addEventListener('click', (e) => {
  if (e.target.classList.contains('card-btn')) {
    const name = e.target.closest('.card').querySelector('.card-name').textContent;
    alert('Agendamento com ' + name + ' em breve.');
  }
});