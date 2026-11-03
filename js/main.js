//Select DOM Items
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");
const menuNav = document.querySelector(".menu-nav");
const menuBranding = document.querySelector(".menu-branding");
const navItems = document.querySelectorAll(".nav-item");

//Set Initial State of Menu to be Hidden
let showMenu = false;

menuBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  if (!showMenu) {
    menuBtn.classList.add("close");
    menu.classList.add("show");
    menuNav.classList.add("show");
    menuBranding.classList.add("show");
    navItems.forEach(item => item.classList.add("show"));
    //Set Menu State
    showMenu = true;
  } else {
    menuBtn.classList.remove("close");
    menu.classList.remove("show");
    menuNav.classList.remove("show");
    menuBranding.classList.remove("show");
    navItems.forEach(item => item.classList.remove("show"));

    //Set Menu State
    showMenu = false;
  }
}

//Appearing Projects
function Appear(){
  var projects = document.querySelectorAll('.project');
  var screenPosition = window.innerHeight/1.2;

  projects.forEach(project => {
    var projectPosition = project.getBoundingClientRect().top;
    

    if(projectPosition < screenPosition){
      project.classList.add('appearing-project');
    }
  });

  
}

//window.addEventListener('scroll', AppearOnScroll);
window.addEventListener('load', Appear);
window.addEventListener('scroll', Appear);

// Cookie consent and Google Analytics
(function () {
  const CONSENT_KEY = 'suenarte_cookie_consent';
  const GA_ID = 'G-5NG1JV7YFM';

  let consentBanner;
  let settingsButton;

  function loadGoogleAnalytics() {
    if (window.suenarteAnalyticsLoaded) return;

    window.suenarteAnalyticsLoaded = true;

    // Grant analytics consent before loading Google Analytics
    gtag('consent', 'update', {
      analytics_storage: 'granted'
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;

    script.onload = function () {
      gtag('js', new Date());
      gtag('config', GA_ID);
    };

    script.onerror = function () {
      window.suenarteAnalyticsLoaded = false;
    };

    document.head.appendChild(script);
  }

  function saveConsent(choice) {
    localStorage.setItem(CONSENT_KEY, choice);

    if (choice === 'accepted') {
      loadGoogleAnalytics();
    } else {
      window['ga-disable-' + GA_ID] = true;

      gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }

    hideConsentBanner();
    showSettingsButton();
  }

  function createConsentBanner() {
    if (consentBanner) {
      consentBanner.hidden = false;
      return;
    }

    consentBanner = document.createElement('div');
    consentBanner.id = 'cookie-consent-banner';
    consentBanner.setAttribute('role', 'dialog');
    consentBanner.setAttribute('aria-label', 'Cookie consent');

    consentBanner.innerHTML = `
      <div class="cookie-consent-content">
        <div class="cookie-consent-text">
          <h3>Cookie preferences</h3>
          <p>
            This website uses Google Analytics to understand how visitors
            use the site. Analytics is disabled unless you choose to allow it.
          </p>
        </div>

        <div class="cookie-consent-actions">
          <button type="button" class="cookie-accept">
            Accept analytics
          </button>

          <button type="button" class="cookie-reject">
            Reject analytics
          </button>
        </div>
      </div>
    `;

    consentBanner
      .querySelector('.cookie-accept')
      .addEventListener('click', function () {
        saveConsent('accepted');
      });

    consentBanner
      .querySelector('.cookie-reject')
      .addEventListener('click', function () {
        saveConsent('rejected');
      });

    document.body.appendChild(consentBanner);
  }

  function hideConsentBanner() {
    if (consentBanner) {
      consentBanner.hidden = true;
    }
  }

  function showSettingsButton() {
    if (settingsButton) return;

    settingsButton = document.createElement('button');
    settingsButton.type = 'button';
    settingsButton.id = 'cookie-settings-button';
    settingsButton.textContent = 'Cookie settings';

    settingsButton.addEventListener('click', function () {
      createConsentBanner();
    });

    document.body.appendChild(settingsButton);
  }

  // Restore the visitor's previous choice
  const savedConsent = localStorage.getItem(CONSENT_KEY);

  if (savedConsent === 'accepted') {
    loadGoogleAnalytics();
    showSettingsButton();
  } else if (savedConsent === 'rejected') {
    showSettingsButton();
  } else {
    createConsentBanner();
  }
})();
