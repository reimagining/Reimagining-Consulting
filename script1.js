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
      closeNav();
    }
  });

  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function openNav() {
    navLinks.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', function() {
    if (navLinks.classList.contains('open')) closeNav();
    else openNav();
  });
  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', closeNav);
  });
