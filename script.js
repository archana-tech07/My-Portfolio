/* ==========================================================================
   ARCHANA. A - PORTFOLIO INTERACTION LOGIC
   Features:
   - Interactive typing effect
   - Ambient particle canvas with subtle network nodes
   - Sticky navbar & active scrollspy
   - Mobile drawer navigation
   - Smooth scroll reveal & animated skill progress bars
   - Interactive project details modal
   - Contact form validation & toast notifications
   - Back to top button with circular SVG scroll progress
   - Dynamic resume download handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Dynamic Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // 2. TYPING EFFECT (HERO SECTION)
  // ==========================================================================
  const typingElement = document.getElementById('typing-text');
  const roles = [
    'Aspiring Software Engineer',
    'C & Java Developer',
    'Modern Web Designer',
    'Computer Science Student @ SXCCE'
  ];

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = true;
  let typingSpeed = 2500;

  function typeText() {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeText, typingSpeed);
  }

  // Begin typing cycle after initial pause
  setTimeout(typeText, 2000);

  // ==========================================================================
  // 3. BACKGROUND PARTICLES CANVAS
  // ==========================================================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.speedY = (Math.random() - 0.5) * 0.45;
        this.color = Math.random() > 0.5 ? 'rgba(168, 85, 247, ' : 'rgba(56, 189, 248, ';
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 75);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = 120;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  // ==========================================================================
  // 4. NAVBAR SCROLL EFFECT & SCROLLSPY
  // ==========================================================================
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-menu .drawer-link');

  function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Sticky Header Styling
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scrollspy: Highlight Active Section
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        drawerLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Update Back to Top Progress Ring
    updateScrollProgress(scrollY);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ==========================================================================
  // 5. MOBILE DRAWER NAVIGATION
  // ==========================================================================
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const backdrop = document.getElementById('backdrop');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    if (navToggle) {
      navToggle.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (navToggle) {
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  // Close drawer when any mobile link is clicked
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
  });

  // ==========================================================================
  // 6. SCROLL REVEAL OBSERVER & SKILL PROGRESS ANIMATION
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left');
  const skillCards = document.querySelectorAll('.skill-card');

  // Ensure all content is immediately marked active on page load
  revealElements.forEach(el => el.classList.add('active'));

  if ('IntersectionObserver' in window) {
    // Skill Bar Fill Observer
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    skillCards.forEach(card => skillsObserver.observe(card));
  } else {
    skillCards.forEach(card => card.classList.add('animated'));
  }

  // ==========================================================================
  // 7. BACK TO TOP BUTTON WITH CIRCULAR PROGRESS
  // ==========================================================================
  const backToTopBtn = document.getElementById('back-to-top');
  const progressFill = document.getElementById('progress-fill');

  let circumference = 0;
  if (progressFill) {
    const radius = progressFill.r.baseVal.value;
    circumference = 2 * Math.PI * radius;
    progressFill.style.strokeDasharray = `${circumference} ${circumference}`;
    progressFill.style.strokeDashoffset = circumference;
  }

  function updateScrollProgress(scrollY) {
    if (!backToTopBtn) return;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;

    if (scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    if (progressFill && circumference) {
      const offset = circumference - (scrollPercent * circumference);
      progressFill.style.strokeDashoffset = offset;
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // 8. PROJECT DETAILS MODAL DATA & CONTROLS
  // ==========================================================================
  const projectModal = document.getElementById('project-modal');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalGithubLink = document.getElementById('modal-github-link');
  const modalClose = document.getElementById('modal-close');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const projectData = {
    studysync: {
      category: 'Student Resource Platform',
      title: 'StudySync',
      github: 'https://github.com/archana-tech07/StudySync',
      html: `
        <p><strong>StudySync</strong> is a student-focused website designed to organize study resources and provide a clean, user-friendly learning experience.</p>
        <h4>Technologies:</h4>
        <p><span class="badge-pill">HTML</span> <span class="badge-pill">CSS</span> <span class="badge-pill">JavaScript</span></p>
        <h4>Key Highlights:</h4>
        <ul>
          <li><strong>Resource Organization:</strong> Clean subject categorization designed to help students quickly retrieve curated study notes and coursework guidelines.</li>
          <li><strong>Distraction-Free UX:</strong> Modern, accessible user interface optimized for prolonged study and focused reading.</li>
          <li><strong>Responsive Design:</strong> Fully responsive layouts built with CSS Flexbox &amp; Grid across desktop and mobile devices.</li>
        </ul>
        <h4>Repository &amp; Status:</h4>
        <p>Source code is live at <a href="https://github.com/archana-tech07/StudySync" target="_blank" rel="noopener noreferrer" class="link-inline">github.com/archana-tech07/StudySync</a>. Live demo is live at <a href="https://archana-tech07.github.io/StudySync/" target="_blank" rel="noopener noreferrer" class="link-inline">archana-tech07.github.io/StudySync</a>.</p>
      `
    },
    store: {
      category: 'E-Commerce Web Application',
      title: "Archana's Store",
      github: 'https://github.com/archana-tech07/Archana-Store',
      html: `
        <p><strong>Archana's Store</strong> is a responsive shopping website featuring product cards, product search, an Add to Cart button, cart count, and a contact popup.</p>
        <h4>Technologies:</h4>
        <p><span class="badge-pill">HTML</span> <span class="badge-pill">CSS</span> <span class="badge-pill">JavaScript</span></p>
        <h4>Key Features:</h4>
        <ul>
          <li><strong>Interactive Product Cards:</strong> Structured product listings with pricing, descriptions, and visual layout.</li>
          <li><strong>Product Search:</strong> Instant client-side search filter helping shoppers locate items quickly.</li>
          <li><strong>Cart Management:</strong> Working Add to Cart button with dynamic header cart count updates.</li>
          <li><strong>Contact Popup:</strong> Modal contact form for quick user inquiries and feedback.</li>
        </ul>
        <h4>Repository &amp; Status:</h4>
        <p>Source code is maintained on GitHub at <a href="https://github.com/archana-tech07/Archana-Store" target="_blank" rel="noopener noreferrer" class="link-inline">github.com/archana-tech07/Archana-Store</a>. Live demo is live at <a href="https://archana-tech07.github.io/Archana-Store/" target="_blank" rel="noopener noreferrer" class="link-inline">archana-tech07.github.io/Archana-Store</a>.</p>
      `
    },
    attendance: {
      category: 'Mini Hackathon Concept',
      title: 'Smart Attendance Tracker',
      github: 'https://github.com/archana-tech07',
      html: `
        <p><strong>Smart Attendance Tracker</strong> is a mini hackathon project concept designed to reduce manual attendance work, discourage proxy attendance, and improve attendance accuracy.</p>
        <h4>Concept Highlights:</h4>
        <ul>
          <li><strong>Problem Identification:</strong> Addressed time lost to manual roll-call registers and transcription errors in large lecture sessions.</li>
          <li><strong>Proxy Prevention Strategy:</strong> Outlined verification safeguards to prevent students from marking attendance on behalf of absent peers.</li>
          <li><strong>Hackathon Ideation:</strong> Pitched and documented during a college mini hackathon as an architectural concept for digital classroom administration.</li>
        </ul>
        <h4>Proposed Architecture:</h4>
        <p><span class="badge-pill">System Architecture</span> <span class="badge-pill">Java / C Logic</span> <span class="badge-pill">Web Interface</span></p>
      `
    }
  };

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data || !projectModal) return;

    modalCategory.innerHTML = data.category;
    modalTitle.innerHTML = data.title;
    modalBody.innerHTML = data.html;
    if (modalGithubLink) {
      modalGithubLink.href = data.github;
    }

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Attach modal triggers for Project Details buttons
  document.querySelectorAll('.project-modal-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = e.currentTarget.getAttribute('data-project');
      openModal(projectId);
    });
  });

  // Attach click handler for "Live Demo Coming Soon" buttons
  document.querySelectorAll('.live-demo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = e.currentTarget.getAttribute('data-project');
      if (projectId === 'studysync') {
        showToast('StudySync Live Demo Coming Soon! Source code is live on GitHub.', 'fa-clock');
      } else if (projectId === 'store') {
        showToast("Archana's Store Live Demo Coming Soon!", 'fa-clock');
      } else {
        showToast('Live Demo Coming Soon!', 'fa-clock');
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeModal();
      }
    });
  }

  // ==========================================================================
  // 9. TOAST NOTIFICATION HELPER
  // ==========================================================================
  const toast = document.getElementById('toast-notification');
  let toastTimer;

  function showToast(message, icon = 'fa-circle-check') {
    if (!toast) return;

    clearTimeout(toastTimer);
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    toast.classList.add('show');

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // ==========================================================================
  // 10. CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const successToast = document.getElementById('form-success-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      let isValid = true;

      // Name Validation
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Message Validation
      if (!messageInput.value.trim()) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (isValid) {
        // Submit button loading state
        const submitBtn = document.getElementById('form-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          if (successToast) {
            successToast.style.display = 'flex';
          }

          showToast('Thank you! Your message has been sent successfully.', 'fa-circle-check');
          contactForm.reset();

          setTimeout(() => {
            if (successToast) successToast.style.display = 'none';
          }, 6000);
        }, 800);
      }
    });

    // Clear error states on input
    ['name', 'email', 'message'].forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('input', () => {
          field.closest('.form-group').classList.remove('has-error');
        });
      }
    });
  }

  // ==========================================================================
  // 11. RESUME DOWNLOAD HANDLER & TOAST CONFIRMATION
  // ==========================================================================
  document.querySelectorAll('.resume-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Downloading Archana\'s Resume (PDF)...', 'fa-file-arrow-down');
    });
  });
});
