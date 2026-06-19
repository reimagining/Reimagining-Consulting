function showPopup(type) {
  document.getElementById('popup-' + type).classList.add('active');
}

function hidePopup(type) {
  document.getElementById('popup-' + type).classList.remove('active');
}

function closeIfOverlay(e, type) {
  if (e.target === e.currentTarget) hidePopup(type);
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    hidePopup('email');
    hidePopup('phone');
  }
});
