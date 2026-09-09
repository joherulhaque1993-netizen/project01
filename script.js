/* ==========================================================================
   কাতলাসেন কাদেরিয়া কামিল মাদ্রাসা — script.js

   Features:
   1. ScrollSpy
   2. Fade-in animation
   3. Slide-left / Slide-right animation
   4. Lazy loading
   5. Infinite scroll — Gallery
   6. Ad visibility tracking
   7. Back-to-top button
   8. Auto-updating copyright year
   9. Smooth navigation
   10. Login system
   11. Password Show / Hide
   ========================================================================== */


document.addEventListener('DOMContentLoaded', function () {


  /* ========================================================================
     1. SCROLLSPY
     বর্তমান সেকশনের Navigation Link Highlight
     ======================================================================== */

  const sectionsArray = Array.from(
    document.querySelectorAll('.page-section[id]')
  );

  const navLinks = document.querySelectorAll('.main-nav a');


  /* Navigation Link Map */

  const navMap = {};

  navLinks.forEach(link => {

    const href = link.getAttribute('href');

    if (href && href.startsWith('#')) {

      const id = href.substring(1);

      navMap[id] = link;
    }

  });


  /* Sticky Navigation Height */

  const mainNav = document.querySelector('.main-nav');

  const stickyHeaderHeight = mainNav
    ? mainNav.getBoundingClientRect().bottom
    : 80;


  /* Active Navigation Update */

  function updateActiveNav() {

    let currentId = null;


    for (const section of sectionsArray) {

      const rect = section.getBoundingClientRect();


      if (rect.top <= stickyHeaderHeight) {

        currentId = section.id;

      } else {

        break;
      }

    }


    navLinks.forEach(link => {

      link.classList.remove('active-link');

    });


    if (currentId && navMap[currentId]) {

      navMap[currentId].classList.add('active-link');

    }

  }


  /* ScrollSpy Observer */

  const scrollSpyObserver = new IntersectionObserver(
    function () {

      updateActiveNav();

    },
    {
      root: null,

      threshold: [
        0,
        0.1,
        0.25,
        0.5,
        0.75,
        1
      ]
    }
  );


  sectionsArray.forEach(section => {

    scrollSpyObserver.observe(section);

  });


  /* Page Load */

  updateActiveNav();



  /* ========================================================================
     2 & 3. FADE-IN / SLIDE ANIMATION
     ======================================================================== */

  const animatedElements = document.querySelectorAll(
    '.fade-in, .slide-left, .slide-right, .page-section'
  );


  const animationObserver = new IntersectionObserver(
    function (entries, observer) {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add('in-view');

          observer.unobserve(entry.target);

        }

      });

    },
    {
      root: null,

      threshold: 0.15
    }
  );


  animatedElements.forEach(element => {

    animationObserver.observe(element);

  });



  /* ========================================================================
     4. LAZY LOADING
     ======================================================================== */

  const lazyImages = document.querySelectorAll(
    'img.lazy-img[data-src]'
  );


  const lazyImageObserver = new IntersectionObserver(
    function (entries, observer) {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          const img = entry.target;

          const imageSource =
            img.getAttribute('data-src');


          if (imageSource) {

            img.src = imageSource;

          }


          img.removeAttribute('data-src');

          img.classList.remove('lazy-img');

          img.classList.add('loaded-img');


          observer.unobserve(img);

        }

      });

    },
    {
      root: null,

      rootMargin: '200px 0px',

      threshold: 0
    }
  );


  lazyImages.forEach(img => {

    lazyImageObserver.observe(img);

  });



  /* ========================================================================
     5. INFINITE SCROLL — GALLERY
     ======================================================================== */

  const galleryGrid =
    document.querySelector('.gallery-grid');


  let galleryItemCount =
    galleryGrid
      ? galleryGrid.children.length
      : 0;


  const MAX_GALLERY_ITEMS = 15;


  if (galleryGrid) {


    /* Sentinel */

    const gallerySentinel =
      document.createElement('div');


    gallerySentinel.className =
      'gallery-sentinel';


    gallerySentinel.style.height =
      '1px';


    galleryGrid.insertAdjacentElement(
      'afterend',
      gallerySentinel
    );


    /* Infinite Scroll Observer */

    const infiniteScrollObserver =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(entry => {


            if (
              entry.isIntersecting &&
              galleryItemCount < MAX_GALLERY_ITEMS
            ) {


              /* একবারে সর্বোচ্চ ৩টি Item */

              for (
                let i = 0;
                i < 3 &&
                galleryItemCount < MAX_GALLERY_ITEMS;
                i++
              ) {


                const newItem =
                  document.createElement('div');


                newItem.className =
                  'gallery-item fade-in';


                newItem.innerHTML =
                  '<i class="fas fa-camera"></i>';


                galleryGrid.appendChild(
                  newItem
                );


                /* নতুন Item-এ Animation */

                animationObserver.observe(
                  newItem
                );


                galleryItemCount++;

              }


              /* Maximum Item পৌঁছে গেলে */

              if (
                galleryItemCount >=
                MAX_GALLERY_ITEMS
              ) {

                infiniteScrollObserver
                  .unobserve(
                    gallerySentinel
                  );


                gallerySentinel.remove();

              }

            }

          });

        },
        {
          root: null,

          rootMargin: '150px 0px',

          threshold: 0
        }
      );


    infiniteScrollObserver.observe(
      gallerySentinel
    );

  }



  /* ========================================================================
     6. AD VISIBILITY TRACKING
     ======================================================================== */

  const adBanners =
    document.querySelectorAll('.ad-banner');


  if (adBanners.length > 0) {


    const adObserver =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(entry => {


            const adId =
              entry.target.getAttribute(
                'data-ad-id'
              ) ||
              'unnamed-ad';


            /* Ad দেখা যাচ্ছে */

            if (entry.isIntersecting) {

              entry.target.dataset.viewStart =
                Date.now();


              console.log(
                `[Ad Tracking] "${adId}" স্ক্রিনে দেখা যাচ্ছে`
              );

            }


            /* Ad আর দেখা যাচ্ছে না */

            else if (
              entry.target.dataset.viewStart
            ) {


              const viewedMs =
                Date.now() -
                Number(
                  entry.target.dataset.viewStart
                );


              console.log(
                `[Ad Tracking] "${adId}" মোট ${(viewedMs / 1000).toFixed(1)} সেকেন্ড দেখা গেছে`
              );


              delete entry.target.dataset.viewStart;

            }

          });

        },
        {
          root: null,

          threshold: 0.5
        }
      );


    adBanners.forEach(ad => {

      adObserver.observe(ad);

    });

  }



  /* ========================================================================
     7. BACK TO TOP BUTTON
     ======================================================================== */


  const backToTopBtn =
    document.createElement('button');


  backToTopBtn.id =
    'backToTopBtn';


  backToTopBtn.setAttribute(
    'type',
    'button'
  );


  backToTopBtn.setAttribute(
    'aria-label',
    'উপরে যান'
  );


  backToTopBtn.setAttribute(
    'title',
    'উপরে যান'
  );


  backToTopBtn.innerHTML =
    '<i class="fas fa-arrow-up"></i>';


  document.body.appendChild(
    backToTopBtn
  );


  /* Home Section */

  const homeSection =
    document.getElementById('home');


  if (homeSection) {


    const backToTopObserver =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(entry => {


            if (entry.isIntersecting) {

              backToTopBtn.classList.remove(
                'show'
              );

            }

            else {

              backToTopBtn.classList.add(
                'show'
              );

            }

          });

        },
        {
          root: null,

          threshold: 0
        }
      );


    backToTopObserver.observe(
      homeSection
    );

  }


  /* Back To Top Click */

  backToTopBtn.addEventListener(
    'click',
    function () {

      window.scrollTo({

        top: 0,

        behavior: 'smooth'

      });

    }
  );



  /* ========================================================================
     8. AUTO-UPDATING COPYRIGHT YEAR
     ======================================================================== */


  const footerText =
    document.querySelector(
      '.site-footer p'
    );


  if (footerText) {


    const currentYear =
      new Date().getFullYear();


    footerText.innerHTML =
      footerText.innerHTML.replace(
        /২০\d{2}|\d{4}/,
        currentYear
      );

  }



  /* ========================================================================
     9. SMOOTH NAVIGATION
     ======================================================================== */


  navLinks.forEach(link => {


    link.addEventListener(
      'click',
      function (event) {


        const targetId =
          this.getAttribute('href');


        if (
          !targetId ||
          !targetId.startsWith('#')
        ) {

          return;

        }


        const targetEl =
          document.querySelector(
            targetId
          );


        if (targetEl) {


          event.preventDefault();


          targetEl.scrollIntoView({

            behavior: 'smooth',

            block: 'start'

          });


          /* Mobile Focus Remove */

          this.blur();

        }

      }
    );

  });



  /* ========================================================================
     10. LOGIN SYSTEM
     ======================================================================== */


  const loginForm =
    document.getElementById(
      'loginForm'
    );


  /* Login Form না থাকলেও অন্য JavaScript চলবে */

  if (loginForm) {


    /* ----------------------------------------------------------------------
       Login Elements
    ---------------------------------------------------------------------- */


    const emailInput =
      document.getElementById(
        'loginEmail'
      );


    const passwordInput =
      document.getElementById(
        'loginPassword'
      );


    const showPasswordBtn =
      document.getElementById(
        'showPassword'
      );


    const loginMessage =
      document.getElementById(
        'loginMessage'
      );



    /* ----------------------------------------------------------------------
       10.1 PASSWORD SHOW / HIDE
    ---------------------------------------------------------------------- */


    if (
      passwordInput &&
      showPasswordBtn
    ) {


      showPasswordBtn.addEventListener(
        'click',
        function () {


          if (
            passwordInput.type ===
            'password'
          ) {


            passwordInput.type =
              'text';


            showPasswordBtn.innerHTML =
              '<i class="fas fa-eye-slash"></i> লুকান';


          }


          else {


            passwordInput.type =
              'password';


            showPasswordBtn.innerHTML =
              '<i class="fas fa-eye"></i> দেখুন';

          }

        }
      );

    }



    /* ----------------------------------------------------------------------
       10.2 LOGIN FORM SUBMIT
    ---------------------------------------------------------------------- */


    loginForm.addEventListener(
      'submit',
      function (event) {


        /* Browser-এর Default Submit বন্ধ */

        event.preventDefault();


        /* পুরোনো Message পরিষ্কার */

        if (loginMessage) {

          loginMessage.textContent =
            '';

          loginMessage.style.color =
            '';

        }


        /* Input Value */

        const email =
          emailInput
            ? emailInput.value.trim()
            : '';


        const password =
          passwordInput
            ? passwordInput.value
            : '';



        /* ------------------------------------------------------------------
           Empty Input Check
        ------------------------------------------------------------------ */


        if (!email || !password) {


          if (loginMessage) {

            loginMessage.textContent =
              'দয়া করে ইমেইল এবং পাসওয়ার্ড দিন।';

            loginMessage.style.color =
              '#ef4444';

          }


          return;

        }



        /* ------------------------------------------------------------------
           Email Validation
        ------------------------------------------------------------------ */


        const emailPattern =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
          !emailPattern.test(email)
        ) {


          if (loginMessage) {

            loginMessage.textContent =
              'সঠিক ইমেইল ঠিকানা লিখুন।';

            loginMessage.style.color =
              '#ef4444';

          }


          if (emailInput) {

            emailInput.focus();

          }


          return;

        }



        /* ------------------------------------------------------------------
           DEMO LOGIN

           এখানে Demo Email ও Password দেওয়া হয়েছে।

           বাস্তব Login হলে এগুলো JavaScript-এ রাখা নিরাপদ নয়।
        ------------------------------------------------------------------ */


        const demoEmail =
          'admin@gmail.com';


        const demoPassword =
          '123456';



        /* ------------------------------------------------------------------
           Login Check
        ------------------------------------------------------------------ */


        if (
          email === demoEmail &&
          password === demoPassword
        ) {


          /* সফল Login */

          if (loginMessage) {

            loginMessage.textContent =
              '✓ Login সফল হয়েছে। স্বাগতম!';

            loginMessage.style.color =
              '#15803d';

          }


          /* Login State Save */

          localStorage.setItem(
            'isLoggedIn',
            'true'
          );


          localStorage.setItem(
            'loggedInEmail',
            email
          );


          /* Form পরিষ্কার */

          loginForm.reset();


        }


        else {


          /* ভুল Login */

          if (loginMessage) {

            loginMessage.textContent =
              '✕ ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।';

            loginMessage.style.color =
              '#ef4444';

          }

        }

      }
    );



    /* ----------------------------------------------------------------------
       10.3 LOGIN INPUT ENTER SUPPORT
    ---------------------------------------------------------------------- */

    [emailInput, passwordInput]
      .forEach(input => {


        if (!input) {

          return;

        }


        input.addEventListener(
          'keydown',
          function (event) {


            if (
              event.key === 'Enter'
            ) {


              loginForm.requestSubmit();

            }

          }
        );

      });

  }



  /* ========================================================================
     11. LOGIN STATUS CHECK
     ======================================================================== */


  const isLoggedIn =
    localStorage.getItem(
      'isLoggedIn'
    );


  if (isLoggedIn === 'true') {


    console.log(
      'ব্যবহারকারী ইতোমধ্যে Login করেছেন।'
    );

  }



  /* ========================================================================
     SCRIPT COMPLETE
     ======================================================================== */


  console.log(
    'কাতলাসেন কাদেরিয়া কামিল মাদ্রাসা — JavaScript সফলভাবে চালু হয়েছে।'
  );


});