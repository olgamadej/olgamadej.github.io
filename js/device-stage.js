/* =========================================================
   DEVICE STAGE
   Drives the responsive-showcase device switcher on product pages.

   Expects, per device, images named:
     img/phone1.png  ... img/phone7.png
     img/tablet1.png ... img/tablet7.png
     img/front1.png  ... img/front7.png

   Update COUNTS below if you end up with more or fewer than 7
   per device.
   ========================================================= */

(function () {

  var COUNTS = { mobile: 11, tablet: 7, desktop: 6 };
  var IMG_PREFIX = { mobile: "../img/dark_gallery/phone", tablet: "../img/dark_gallery/tab", desktop: "../img/dark_gallery/front" };
  var LABEL = { mobile: "MOBILE", tablet: "TABLET", desktop: "DESKTOP" };

  var CHROME_HTML = {
    desktop:
      '<span class="ds-dot"></span>' +
      '<span class="ds-dot"></span>' +
      '<span class="ds-dot"></span>' +
      '<span class="ds-url">suenarte.studio/product-1</span>',
    tablet: '<span class="ds-cam"></span>',
    mobile: '<span class="ds-notch"></span>'
  };

  var stage = document.getElementById("dsStage");
  if (!stage) return;

  var frame = document.getElementById("dsFrame");
  var chrome = document.getElementById("dsChrome");
  var screen = document.getElementById("dsScreen");
  var image = document.getElementById("dsImage");
  var counter = document.getElementById("dsCounter");
  var prevBtn = document.getElementById("dsPrev");
  var nextBtn = document.getElementById("dsNext");
  var switchBtns = document.querySelectorAll(".ds-switch-btn");
  var peeks = document.querySelectorAll(".ds-peek");

  var device = "desktop";
  var page = 1;

  function render() {
    frame.className = "ds-frame ds-frame-" + device;
    chrome.className = "ds-chrome ds-chrome-" + device;
    chrome.innerHTML = CHROME_HTML[device];
    screen.scrollTop = 0;

    image.src = IMG_PREFIX[device] + page + ".png";
    image.alt = "Product 1 " + device + " view " + page;

    counter.textContent = LABEL[device] + " \u2014 " + page + " / " + COUNTS[device];

    switchBtns.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.device === device);
    });

    peeks.forEach(function (peek) {
      peek.style.display = peek.dataset.device === device ? "none" : "";
    });
  }

  function setDevice(nextDevice) {
    if (nextDevice === device) return;
    device = nextDevice;
    page = 1;
    render();
  }

  function step(delta) {
    var max = COUNTS[device];
    page = ((page - 1 + delta + max) % max) + 1;
    render();
  }

  switchBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setDevice(btn.dataset.device);
    });
  });

  peeks.forEach(function (peek) {
    peek.addEventListener("click", function () {
      setDevice(peek.dataset.device);
    });
  });

  if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { step(1); });

  image.addEventListener("error", function () {
    image.alt = "Add " + IMG_PREFIX[device] + page + ".png";
  });

  render();

})();