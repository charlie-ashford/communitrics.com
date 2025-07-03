const body = document.body;
const html = document.documentElement;
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');

let currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
if (currentTheme === 'light') {
  body.classList.add('light-mode');
}

function createSidebarOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.addEventListener('click', closeSidebar);
  document.body.appendChild(overlay);
  return overlay;
}

function updateSidebarHTML() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const currentPath = window.location.pathname;
  let navigationHTML = '';

  if (currentPath === '/privacy') {
    navigationHTML = `
      <a href="/" class="nav-link">
        <i class="fas fa-home"></i>
        Home
      </a>
      <a href="/terms" class="nav-link">
        <i class="fas fa-file-contract"></i>
        Terms of Service
      </a>
    `;
  } else if (currentPath === '/terms') {
    navigationHTML = `
      <a href="/" class="nav-link">
        <i class="fas fa-home"></i>
        Home
      </a>
      <a href="/privacy" class="nav-link">
        <i class="fas fa-shield-alt"></i>
        Privacy Policy
      </a>
    `;
  } else {
    navigationHTML = `
      <a href="#how-it-works" class="nav-link">
        <i class="fas fa-cog"></i>
        How It Works
      </a>
      <a href="#showcase" class="nav-link">
        <i class="fas fa-play"></i>
        Showcase
      </a>
      <a href="#features" class="nav-link">
        <i class="fas fa-star"></i>
        Features
      </a>
    `;
  }

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <i class="fas fa-chart-line"></i>
        Communitrics
      </div>
      <button class="sidebar-close" aria-label="Close menu">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <nav class="nav-menu">
      ${navigationHTML}
    </nav>
    
    <div class="sidebar-footer">
      <a href="https://communitrics.com/invite" target="_blank" class="btn-invite">
        <i class="fab fa-discord"></i>
        Add to Discord
      </a>
      
      <div class="sidebar-actions">
        <button class="sidebar-action-btn" id="toggleThemeBtnSidebar" aria-label="Toggle theme">
          <i class="fas fa-sun"></i>
          Theme
        </button>
        <button class="sidebar-action-btn" id="scrollToTopBtnSidebar" aria-label="Scroll to top">
          <i class="fas fa-arrow-up"></i>
          Top
        </button>
      </div>
      
      <div class="sidebar-info">
        Track YouTube channels in real-time with beautiful Discord notifications
      </div>
    </div>
  `;

  const closeBtn = sidebar.querySelector('.sidebar-close');
  closeBtn?.addEventListener('click', closeSidebar);

  const themeBtn = sidebar.querySelector('#toggleThemeBtnSidebar');
  themeBtn?.addEventListener('click', toggleTheme);

  const scrollBtn = sidebar.querySelector('#scrollToTopBtnSidebar');
  scrollBtn?.addEventListener('click', scrollToTop);
}

const sidebarOverlay = createSidebarOverlay();

function updateThemeIcons(theme) {
  const icon =
    theme === 'dark'
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  if (toggleThemeBtn) toggleThemeBtn.innerHTML = icon;

  const sidebarThemeBtn = document.getElementById('toggleThemeBtnSidebar');
  if (sidebarThemeBtn) {
    sidebarThemeBtn.innerHTML = `${icon} Theme`;
  }
}

updateThemeIcons(currentTheme);

function toggleTheme() {
  const isDark = html.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  body.classList.toggle('light-mode', newTheme === 'light');
  updateThemeIcons(newTheme);
}

toggleThemeBtn?.addEventListener('click', toggleTheme);

function openSidebar() {
  const sidebar = document.querySelector('.sidebar');
  hamburger.classList.add('active');
  sidebar.classList.add('active');
  sidebarOverlay.classList.add('active');
  body.classList.add('no-scroll');
}

function closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  hamburger.classList.remove('active');
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  body.classList.remove('no-scroll');
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar.classList.contains('active')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

hamburger?.addEventListener('click', e => {
  e.stopPropagation();
  toggleSidebar();
});

function handleScroll() {
  const scrolled = window.pageYOffset > 300;
  scrollToTopBtn?.classList.toggle('show', scrolled);
  toggleThemeBtn?.classList.toggle('move-up', scrolled);
}

window.addEventListener('scroll', handleScroll);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

scrollToTopBtn?.addEventListener('click', scrollToTop);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    const headerOffset = 100;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = window.pageYOffset + elementPosition - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

    if (window.innerWidth <= 885 && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });
});

function formatNumber(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

function animateCounter(element, target, duration = 2_000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = formatNumber(Math.floor(current));
  }, 16);
}

async function loadStats(maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch('https://api.communitrics.com/total-stats', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const data = await res.json();
      if (typeof data.total_servers === 'undefined') {
        throw new Error('Invalid data');
      }
      return {
        servers: data.total_servers,
        channels: data.unique_channels,
        subscribers: data.total_subscribers,
      };
    } catch (err) {
      if (attempt === maxRetries) {
        console.error('Using fallback stats');
        return {
          servers: 416,
          channels: 7122,
          subscribers: 53_929_533_826,
        };
      }
      await new Promise(r => setTimeout(r, 1_000 * attempt));
    }
  }
}

function initHeroAnimations() {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 200);
  }

  const underlineSvg = document.querySelector('.underline-svg path');
  if (underlineSvg) {
    const pathLength = underlineSvg.getTotalLength();

    const drawLength = pathLength * 0.69;

    underlineSvg.style.fill = 'none';
    underlineSvg.style.stroke = 'rgba(255, 59, 63, 0.8)';
    underlineSvg.style.strokeWidth = '5';
    underlineSvg.style.strokeLinecap = 'round';
    underlineSvg.style.strokeDasharray = drawLength + ' ' + pathLength;
    underlineSvg.style.strokeDashoffset = drawLength;
    underlineSvg.style.transition = 'none';

    setTimeout(() => {
      underlineSvg.style.transition = 'stroke-dashoffset 1s ease-out';
      underlineSvg.style.strokeDashoffset = '0';
    }, 400);
  }
}

function initLegalPageAnimations() {
  const legalPage = document.querySelector('.legal-page');
  const legalContent = document.querySelector('.legal-content');
  const legalHeader = document.querySelector('.legal-header');

  if (legalContent && legalHeader) {
    legalPage.classList.add('loaded');
    legalHeader.style.opacity = '0';
    legalHeader.style.transform = 'translateY(20px)';
    legalContent.style.opacity = '0';
    legalContent.style.transform = 'translateY(30px)';

    setTimeout(() => {
      legalHeader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      legalHeader.style.opacity = '1';
      legalHeader.style.transform = 'translateY(0)';

      setTimeout(() => {
        legalContent.style.transition =
          'opacity 0.8s ease, transform 0.8s ease';
        legalContent.style.opacity = '1';
        legalContent.style.transform = 'translateY(0)';
      }, 200);
    }, 100);
  }
}

function initStatsAnimation() {
  const heroStats = document.querySelector('.hero-stats');
  if (!heroStats) return;
  const statsObserver = new IntersectionObserver(
    async entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const statsData = await loadStats();
          const elems = document.querySelectorAll('.stat-number');
          const values = [
            statsData.servers,
            statsData.channels,
            statsData.subscribers,
          ];
          heroStats.style.opacity = '1';
          heroStats.style.transform = 'translateY(0)';
          elems.forEach((el, i) => {
            animateCounter(el, values[i], 2_000);
          });
          statsObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.3 }
  );
  statsObserver.observe(heroStats);
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  document
    .querySelectorAll('.feature-card, .showcase-card, .step')
    .forEach((el, idx) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${
        idx * 0.1
      }s, transform 0.6s ease ${idx * 0.1}s`;
      observer.observe(el);
    });
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll('.section-header, .cta-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(el);
  });
}

function initHeaderScrollEffect() {
  let lastScroll = 0;
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScroll && st > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScroll = st <= 0 ? 0 : st;
  });
}

function initButtonEffects() {
  document
    .querySelectorAll('.btn-primary, .btn-secondary, .btn-invite')
    .forEach(btn => {
      btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
      });
    });
}

function handleReducedMotion() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    document.documentElement.style.setProperty('--transition-speed', '0.01s');
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateSidebarHTML();
  initHeroAnimations();
  initLegalPageAnimations();
  initStatsAnimation();
  initScrollAnimations();
  initHeaderScrollEffect();
  initButtonEffects();
  handleReducedMotion();

  const heroBg = document.querySelector('.hero-background');
  if (
    heroBg &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    window.addEventListener('scroll', () => {
      const y = window.pageYOffset;
      heroBg.style.transform = `translateY(${y * -0.3}px)`;
    });
  }
});
