const body = document.body;
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const toggleThemeBtnSidebar = document.getElementById('toggleThemeBtnSidebar');
const themeIcons = document.querySelectorAll(
  'button[aria-label="Toggle theme"] i'
);

function updateThemeIcons() {
  if (body.classList.contains('light-mode')) {
    themeIcons.forEach(icon => {
      icon.className = 'fas fa-moon';
    });
  } else {
    themeIcons.forEach(icon => {
      icon.className = 'fas fa-sun';
    });
  }
}

if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-mode');
  updateThemeIcons();
}

function toggleTheme() {
  body.classList.toggle('light-mode');
  updateThemeIcons();
  localStorage.setItem(
    'theme',
    body.classList.contains('light-mode') ? 'light' : 'dark'
  );
}

toggleThemeBtn.addEventListener('click', toggleTheme);
toggleThemeBtnSidebar.addEventListener('click', toggleTheme);

const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

hamburger.addEventListener('click', e => {
  e.stopPropagation();
  hamburger.classList.toggle('active');
  sidebar.classList.toggle('active');
});

document.addEventListener('click', e => {
  if (
    !sidebar.contains(e.target) &&
    !hamburger.contains(e.target) &&
    sidebar.classList.contains('active')
  ) {
    hamburger.classList.remove('active');
    sidebar.classList.remove('active');
  }
});

const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const scrollToTopBtnSidebar = document.getElementById('scrollToTopBtnSidebar');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 200) {
    scrollToTopBtn.classList.add('show');
  } else {
    scrollToTopBtn.classList.remove('show');
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

scrollToTopBtn.addEventListener('click', scrollToTop);
scrollToTopBtnSidebar.addEventListener('click', scrollToTop);

const sections = document.querySelectorAll('.content-section');

function showSection(sectionId) {
  sections.forEach(section => {
    if (section.id === sectionId) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  navLinks.forEach(link => {
    if (link.dataset.section === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  if (window.innerWidth <= 768) {
    hamburger.classList.remove('active');
    sidebar.classList.remove('active');
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const section = link.dataset.section;
    showSection(section);
  });
});
