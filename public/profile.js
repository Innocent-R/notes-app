document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const noteCard = e.target.closest('.note-card');
      const id = noteCard.dataset.id;

      try {
        const res = await fetch('/deleteNote', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        if (res.ok) {
          noteCard.remove();
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
});
