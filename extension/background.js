// Ouvrir automatiquement le panneau latéral au clic sur l'icône de l'extension
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
