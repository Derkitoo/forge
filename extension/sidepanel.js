document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const prompt = card.getAttribute('data-prompt');
    navigator.clipboard.writeText(prompt).then(() => {
      const toast = document.getElementById('toast');
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 2000);
    });
  });
});

document.getElementById('btn-open-web').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://derkitoo.github.io/forge/' });
});
