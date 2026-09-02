/**
 * myip - Main App Coordinator & Navigation Router
 */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  activeTab: 'myip',

  init() {
    if (window.I18n) window.I18n.init();
    this.initTheme();
    this.initNavigation();
    this.initModules();
    this.handleInitialRoute();
  },

  /**
   * Initialize Theme (Light as default / Dark) with LocalStorage persistence
   */
  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        Utils.showToast(`Modo ${newTheme === 'dark' ? 'Escuro' : 'Claro'} ativado`, 'info', 1800);
      });
    }
  },

  /**
   * Navigation router for tabs (Desktop & Mobile)
   */
  initNavigation() {
    // Desktop Nav buttons
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Mobile Drawer buttons
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const mobileDrawer = document.getElementById('mobile-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

    mobileNavItems.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
        if (mobileDrawer) mobileDrawer.classList.remove('open');
      });
    });

    // Mobile Hamburger Toggle
    if (mobileMenuToggle && mobileDrawer) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
      });

      // Close mobile drawer when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileDrawer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
          mobileDrawer.classList.remove('open');
        }
      });
    }

    // Footer tab links
    const footerLinks = document.querySelectorAll('.footer-right a, #nav-brand');
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab || 'myip';
        this.switchTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

  },

  validTabs: [
    'myip',
    'calculator',
    'speedtest',
    'password',
    'webrtc',
    'dnslookup',
    'portcheck',
    'wifiqr',
    'sslcheck',
    'ipconvert'
  ],

  isValidTab(tabName) {
    return this.validTabs.includes(tabName);
  },

  /**
   * Handle route when page loads
   */
  handleInitialRoute() {
    const hash = window.location.hash.replace('#', '');
    const savedTab = sessionStorage.getItem('activeTab');
    
    let initialTab = 'myip';
    if (this.isValidTab(hash)) {
      initialTab = hash;
    } else if (this.isValidTab(savedTab)) {
      initialTab = savedTab;
    }

    // Clean any hash from address bar if present
    if (window.location.hash && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    this.switchTab(initialTab);
  },

  /**
   * Switch active tab view without modifying URL
   * @param {string} tabName 
   */
  switchTab(tabName) {
    if (!this.isValidTab(tabName)) return;

    this.activeTab = tabName;
    try {
      sessionStorage.setItem('activeTab', tabName);
    } catch (e) {
      // Ignored if storage is restricted
    }

    // Ensure URL has no hash
    if (window.location.hash && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Update active class on tab panes
    const panes = document.querySelectorAll('.tab-pane');
    panes.forEach(pane => {
      pane.classList.remove('active');
    });

    const targetPane = document.getElementById(`pane-${tabName}`);
    if (targetPane) {
      targetPane.classList.add('active');
    }

    // Update Desktop Nav
    const desktopButtons = document.querySelectorAll('.nav-item');
    desktopButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update Mobile Nav
    const mobileButtons = document.querySelectorAll('.mobile-nav-item');
    mobileButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Scroll tools navbar so active button is visible
    const activeBtn = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // If switching back to MyIP tab, invalidate Leaflet map size so it renders properly
    if (tabName === 'myip' && window.MyIPModule && window.MyIPModule.mapInstance) {
      setTimeout(() => {
        window.MyIPModule.mapInstance.invalidateSize();
      }, 200);
    }
  },

  /**
   * Initialize child modules
   */
  initModules() {
    if (window.MyIPModule) window.MyIPModule.init();
    if (window.IPCalcModule) window.IPCalcModule.init();
    if (window.PasswordModule) window.PasswordModule.init();
    if (window.SpeedTestModule) window.SpeedTestModule.init();
    if (window.WebRTCModule) window.WebRTCModule.init();
    if (window.DNSLookupModule) window.DNSLookupModule.init();
    if (window.PortCheckModule) window.PortCheckModule.init();
    if (window.WiFiQRModule) window.WiFiQRModule.init();
    if (window.SSLCheckModule) window.SSLCheckModule.init();
    if (window.IPConvertModule) window.IPConvertModule.init();
  }
};

window.App = App;
