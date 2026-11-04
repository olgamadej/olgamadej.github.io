// Brand name and logo hide/show on scroll with delayed timing
    const brandName = document.getElementById('brand-name');
    const brandLine = document.getElementById('brand-line');
    const brandSpec = document.getElementById('brand-spec');
    const brandLogo = document.getElementById('brand-logo');

    let lastScrollTop = 0;
    let scrollTimeout;
    let nameHidden = false;
    let lineHidden = false;
    let brandSpecHidden = false;
    let logoHidden = false;

    function handleBrandVisibility() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollingDown = currentScrollTop > lastScrollTop;
        const scrollingUp = currentScrollTop < lastScrollTop;
        const isAtTop = currentScrollTop < 50;

        // Clear any pending timeouts
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        if (scrollingDown && currentScrollTop > 50 && !nameHidden) {
            // SCROLLING DOWN - Hide name first, then logo after 0.2s

            // Hide name immediately
            brandName.classList.add('brand-hidden');
            brandName.classList.remove('brand-visible');
            nameHidden = true;

            // Hide line after 0.14s delay
            brandLine.classList.add('brand-hidden');
            brandLine.classList.remove('brand-visible');
            brandLineHidden = true;

            // Hide spec after 0.28s delay
            brandSpec.classList.add('brand-hidden');
            brandSpec.classList.remove('brand-visible');
            brandSpecHidden = true;

            // Hide logo after 0.4s delay
            brandLogo.classList.add('brand-hidden');
            brandLogo.classList.remove('brand-visible');
            logoHidden = true;
            
        } else if ((scrollingUp || isAtTop) && (nameHidden || logoHidden)) {
            // SCROLLING UP - Show both with logo sliding slower

            // Show name immediately
            brandName.classList.remove('brand-hidden');
            brandName.classList.add('brand-visible');
            nameHidden = false;

            // Show line immediately
            brandLine.classList.remove('brand-hidden');
            brandLine.classList.add('brand-visible');
            brandLineHidden = false;

            // Show spec immediately
            brandSpec.classList.remove('brand-hidden');
            brandSpec.classList.add('brand-visible');
            brandSpecHidden = false;

            // Show logo with slight delay but slower animation
            brandLogo.classList.remove('brand-hidden');
            brandLogo.classList.add('brand-visible');
            logoHidden = false;
        } else {console.log('logo change not activated');}

        lastScrollTop = currentScrollTop;
    }


    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            this.window.requestAnimationFrame(function() {
                handleBrandVisibility();
                ticking = false;
            });
        ticking = true;
        } else {
            console.log('visibility change not activated');
        }
    });
    
    // Initital state - visible
    brandName.classList.add('brand-visible');
    brandLine.classList.add('brand-visible');
    brandSpec.classList.add('brand-visible');
    brandLogo.classList.add('brand-visible');
    console.log(brandLogo.classList);
