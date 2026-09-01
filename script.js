/* ==========================================================================
   CS-CATALYST SOCIETY — Multi-Page JavaScript Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initQuantumCanvas();
  initNavigation();
  initThemeToggle();
  injectFooter();

  // Page-specific initializations (safe no-op if element absent)
  initCountdownTimer();
  initStatsCounter();
  initEventFilters();
  initResponsibilitiesToggle();
  initFileUpload();
  initOrganizingPanelForm();
});

/* --------------------------------------------------------------------------
   1. Quantum Canvas Particle Background
   -------------------------------------------------------------------------- */
function initQuantumCanvas() {
  // Disabled as requested (no moving dots in the background)
}

/* --------------------------------------------------------------------------
   2. Countdown Timer (Q-BIT: Sept 07, 2026)
   -------------------------------------------------------------------------- */
function initCountdownTimer() {
  const dEl = document.getElementById('days');
  const hEl = document.getElementById('hours');
  const mEl = document.getElementById('mins');
  const sEl = document.getElementById('secs');
  if (!dEl) return;

  const target = new Date('September 7, 2026 09:00:00').getTime();

  function update() {
    const diff = target - Date.now();
    if (diff < 0) { dEl.innerText = hEl.innerText = mEl.innerText = sEl.innerText = '00'; return; }
    dEl.innerText = String(Math.floor(diff / 86400000)).padStart(2, '0');
    hEl.innerText = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    mEl.innerText = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    sEl.innerText = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   3. Stats Counter Animation
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNums = document.querySelectorAll('.stat-number');
  if (!statNums.length) return;
  let animated = false;
  const ob = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !animated) {
        animated = true;
        statNums.forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          let cur = 0;
          const step = Math.max(1, Math.ceil(target / 45));
          const iv = setInterval(() => {
            cur += step;
            if (cur >= target) { el.innerText = target; clearInterval(iv); }
            else el.innerText = cur;
          }, 28);
        });
      }
    });
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) ob.observe(statsEl);
}

/* --------------------------------------------------------------------------
   4. Navigation & Hamburger
   -------------------------------------------------------------------------- */
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  const originalParent = navMenu.parentElement; // Store original location in desktop navbar

  // Create dark overlay element attached directly to body
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  // Inject top header bar (Logo + Close X) inside drawer
  if (!navMenu.querySelector('.nav-drawer-header')) {
    const drawerHeader = document.createElement('div');
    drawerHeader.className = 'nav-drawer-header';
    drawerHeader.innerHTML = `
      <div class="nav-drawer-logo" style="display:flex;align-items:center;gap:10px;">
        <img src="images/logo.png" alt="CS-CATALYST" style="width:34px;height:34px;border-radius:50%;">
        <div>
          <div style="font-family:var(--font-heading);font-weight:800;font-size:0.95rem;color:#111827;line-height:1.2;">CS-CATALYST</div>
          <div style="font-size:0.65rem;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">CSE Dept · TIET Patiala</div>
        </div>
      </div>
      <button class="nav-drawer-close" aria-label="Close menu">&times;</button>
    `;
    navMenu.prepend(drawerHeader);

    const closeBtn = drawerHeader.querySelector('.nav-drawer-close');
    closeBtn.addEventListener('click', closeDrawer);
  }

  function openDrawer() {
    if (window.innerWidth <= 1024 && navMenu.parentElement !== document.body) {
      document.body.appendChild(navMenu);
    }
    navMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function restoreDesktopNav() {
    closeDrawer();
    if (originalParent && navMenu.parentElement !== originalParent) {
      originalParent.appendChild(navMenu);
    }
  }

  // Open/Close toggle on hamburger click
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navMenu.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  // Close on link click
  navMenu.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', closeDrawer);
  });

  // Close on overlay click
  overlay.addEventListener('click', closeDrawer);

  // Restore desktop nav if resized above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      restoreDesktopNav();
    }
  });

  // Handle transparent to white sticky navbar on scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5. Theme Toggle
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  document.body.classList.add('light-theme');
  document.body.classList.remove('dark-theme');
  localStorage.setItem('cs_theme', 'light');
}

/* --------------------------------------------------------------------------
   6. Inject Shared Footer
   -------------------------------------------------------------------------- */
function injectFooter() {
  const ph = document.getElementById('footer-placeholder');
  if (!ph) return;
  ph.outerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col brand-col">
          <div class="footer-brand">
            <img src="images/logo.png" alt="CS-CATALYST Logo" class="footer-logo" style="width:48px;height:48px;object-fit:contain;">
            <div><h3>CS-CATALYST</h3><p>CSE Dept · TIET Patiala</p></div>
          </div>
          <p class="footer-about">The official Computer Science &amp; Engineering departmental society at Thapar Institute of Engineering &amp; Technology, Patiala, driving FDPs, STCs, quantum workshops, and student leadership.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a href="index.html"><i class="fa-solid fa-angle-right"></i> Home</a></li>
            <li><a href="about.html"><i class="fa-solid fa-angle-right"></i> About CS-CATALYST</a></li>
            <li><a href="events.html"><i class="fa-solid fa-angle-right"></i> Events &amp; FDPs</a></li>
            <li><a href="gallery.html"><i class="fa-solid fa-angle-right"></i> Photo Gallery</a></li>
            <li><a href="team.html"><i class="fa-solid fa-angle-right"></i> Faculty &amp; Team</a></li>
            <li><a href="contact.html"><i class="fa-solid fa-angle-right"></i> Contact Us</a></li>
            <li><a href="apply.html"><i class="fa-solid fa-angle-right"></i> Apply for Panel</a></li>
          </ul>
        </div>
       
        <div class="footer-col">
          <h4>Contact</h4>
          <p class="contact-info"><i class="fa-solid fa-location-dot"></i> CSE Department, Thapar Institute, Patiala, Punjab — 147004</p>
          <p class="contact-info"><i class="fa-solid fa-envelope"></i> sandeep.verma@thapar.edu</p>
          <div class="social-icons" style="margin-top: 15px;">
            <a href="https://linkedin.com/company/cs-catalyst-tiet" target="_blank" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="https://instagram.com/cs_catalyst_tiet" target="_blank" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://wa.me/919914374003" target="_blank" title="WhatsApp Support"><i class="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>
      </div>
    </div>
  </footer>`;
}

/* --------------------------------------------------------------------------
   7. Events Gallery Filter & Search (events.html)
   -------------------------------------------------------------------------- */
function initEventFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('.event-card');
  const searchInput = document.getElementById('eventSearchInput');
  if (!filterBtns.length) return;

  function filterEvents() {
    const active = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const q = (searchInput?.value || '').toLowerCase().trim();
    eventCards.forEach(card => {
      const cats = card.dataset.category || '';
      const text = card.innerText.toLowerCase();
      const ok = (active === 'all' || cats.includes(active)) && text.includes(q);
      card.style.display = ok ? 'flex' : 'none';
    });
  }
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterEvents();
    });
  });
  searchInput?.addEventListener('input', filterEvents);
}

/* --------------------------------------------------------------------------
   8. Responsibilities Accordion (apply.html)
   -------------------------------------------------------------------------- */
function initResponsibilitiesToggle() {
  const toggle = document.getElementById('respToggle');
  const content = document.getElementById('respContent');
  if (!toggle || !content) return;
  toggle.addEventListener('click', () => {
    const open = content.style.display !== 'none';
    content.style.display = open ? 'none' : 'block';
    const icon = toggle.querySelector('.toggle-icon i');
    if (icon) icon.className = open ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up';
  });
}

/* --------------------------------------------------------------------------
   9. File Upload (apply.html)
   -------------------------------------------------------------------------- */
function initFileUpload() {
  const zone = document.getElementById('fileDropZone');
  const input = document.getElementById('resumeFileInput');
  const display = document.getElementById('fileNameDisplay');
  if (!zone || !input) return;

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => { if (input.files.length) handleFile(input.files[0]); });

  function handleFile(file) {
    if (display) display.innerHTML = `<i class="fa-solid fa-file-pdf" style="color:#ff007f"></i> <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
    showToast(`Resume attached: ${file.name}`, 'success');
  }
}

/* --------------------------------------------------------------------------
   10. Organizing Panel Form Submission (apply.html)
   -------------------------------------------------------------------------- */
function initOrganizingPanelForm() {
  const form = document.getElementById('organizingPanelForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const terms = document.getElementById('agreeTerms').checked;
    const fileEl = document.getElementById('resumeFileInput');

    if (!terms) { showToast('Please agree to the member responsibilities.', 'error'); return; }
    if (!fileEl?.files?.length) { showToast('Please attach your resume PDF.', 'error'); return; }

    const ref = 'CSC-2026-' + Math.floor(10000 + Math.random() * 90000);
    const data = {
      ref, name,
      roll: document.getElementById('rollNo').value.trim(),
      year: document.getElementById('yearSemester').value,
      email: document.getElementById('emailAddr').value.trim(),
      phone: document.getElementById('phoneNo').value.trim(),
      domain: document.getElementById('primaryDomain').value,
      sop: document.getElementById('sopText').value.trim(),
      file: fileEl.files[0].name,
      at: new Date().toISOString()
    };

    const apps = JSON.parse(localStorage.getItem('cs_catalyst_applications') || '[]');
    apps.push(data);
    localStorage.setItem('cs_catalyst_applications', JSON.stringify(apps));

    document.getElementById('submittedApplicantName').innerText = name;
    document.getElementById('appRefCode').innerText = ref;
    document.getElementById('appSuccessModal').classList.add('active');
    form.reset();
    const disp = document.getElementById('fileNameDisplay');
    if (disp) disp.innerHTML = `Drag & Drop your Resume here, or <span class="browse-link">Browse</span>`;
  });
}

function closeAppSuccessModal() {
  document.getElementById('appSuccessModal')?.classList.remove('active');
}

/* --------------------------------------------------------------------------
   11. Q-BIT Registration Modal (events.html)
   -------------------------------------------------------------------------- */
function openQbitModal() {
  document.getElementById('qbitModal')?.classList.add('active');
}
function closeQbitModal() {
  const m = document.getElementById('qbitModal');
  if (m) {
    m.classList.remove('active');
    document.getElementById('qbitRegForm')?.style.removeProperty('display');
    document.getElementById('qbitSuccessBox')?.classList.add('hidden');
  }
}
function toggleScheduleDrawer() {
  const d = document.getElementById('scheduleDrawer');
  if (!d) return;
  const open = d.style.display === 'block';
  d.style.display = open ? 'none' : 'block';
  if (!open) d.scrollIntoView({ behavior: 'smooth' });
}
function handleQbitRegister(e) {
  e.preventDefault();
  const name = document.getElementById('qbitName')?.value || 'Participant';
  const passId = 'QBIT-2026-' + Math.floor(1000 + Math.random() * 9000);
  const pidEl = document.getElementById('passIdCode');
  if (pidEl) pidEl.innerText = passId;
  document.getElementById('qbitRegForm').style.display = 'none';
  document.getElementById('qbitSuccessBox')?.classList.remove('hidden');
  showToast(`Registration confirmed for ${name}!`, 'success');
}

/* --------------------------------------------------------------------------
   12. Event Details Modal Database
   -------------------------------------------------------------------------- */
const eventDatabase = {
  'drone-fdp': {
    title: 'DRONE-FIT: Drone Flight & Industrial Training',
    category: 'COMPLETED TRAINING',
    meta: 'August 10–12, 2026 · LT-201, TIET',
    desc: '3-Day hands-on training program covering drone flight training, industrial use cases and applications, mission planning and data analysis, safety, regulations, and best practices.',
    highlights: [
      'Hands-on Drone Flight Training',
      'Industrial Use Cases & Applications',
      'Mission Planning & Data Analysis',
      'Safety, Regulations & Best Practices'
    ]
  },
  'green-ai-workshop': {
    title: 'One-Day Workshop on Green Intelligence: Responsible and Sustainable Artificial Intelligence',
    category: 'COMPLETED WORKSHOP',
    meta: 'February 06, 2026 · LT-202, TIET Patiala',
    desc: 'One-Day Workshop organized by the Department of Computer Science & Engineering, TIET Patiala, in collaboration with CEEDS (Council for Entrepreneurship Enablement, Decarbonization & Sustainability). The workshop focused on sustainable AI models, responsible machine learning practices, decarbonization, and alignment with UN Sustainable Development Goals.',
    highlights: [
      'Green Intelligence & Sustainable AI Architecture',
      'Responsible AI & Decarbonization Strategies',
      'UN SDGs Alignment: SDG 3, 7, 13 & 15',
      'Joint Collaboration between CSE TIET & CEEDS'
    ]
  },
  'drone-bootcamp-2025': {
    title: 'Five-Day Bootcamp on Exploring Drone Technology, Assembly & Flying',
    category: 'COMPLETED BOOTCAMP',
    meta: 'August 04–08, 2025 · TIET Patiala (Offline)',
    desc: '5-Day intensive bootcamp organized by the Department of Computer Science and Engineering, TIET Patiala in collaboration with Dr. B. R. Ambedkar National Institute of Technology Jalandhar (NITJ), sponsored by TIET & NITJ under MeitY, Govt. of India. The program equipped participants with hands-on knowledge in drone hardware assembly, flight operations, autonomous navigation systems, AI/ML integration, and real-time sensor data analysis.',
    highlights: [
      'Drone Hardware Components & Assembly',
      'Autonomous Navigation & Flight Operations',
      'AI & Machine Learning Integration',
      'Applications in Agriculture & Surveillance',
      'Cyber Security & Regulations for Drones',
      'Jointly Organized with NIT Jalandhar (MeitY Sponsored)'
    ]
  },
  'quantum-fdp-2025': {
    title: 'Hybrid Faculty Development Programme on Quantum Computing',
    category: 'COMPLETED FDP',
    meta: 'November 17–22, 2025 · Hybrid (TIET Patiala & IIITDM Jabalpur)',
    desc: '6-Day Faculty Development Programme jointly organized by Thapar Institute of Engineering & Technology (TIET), Patiala, Punjab and Electronics & ICT Academy, IIITDM Jabalpur under the Ministry of Electronics and Information Technology (MeitY), Government of India (Digital India Initiative). The program empowered educators and researchers with quantum mechanics, superposition, Qiskit circuits, quantum algorithms, and post-quantum cryptography.',
    highlights: [
      'Quantum Computing Fundamentals & Qubit Mechanics',
      'Qiskit Circuit Design & Quantum Algorithms',
      'Joint Initiative with E&ICT Academy IIITDM Jabalpur',
      'MeitY & Digital India Government Initiative',
      'Post-Quantum Cryptography & Hardware Architecture'
    ]
  },
  'cloud-fdp': { title: 'National FDP on Cloud Infrastructure & HPC Architectures', category: 'COMPLETED FDP', meta: 'May 14–18, 2026 · CSE Computer Lab 3', desc: '5-Day Faculty Development Program delivered by leading HPC researchers. Topics: Kubernetes, GPU acceleration, parallel MPI, cloud cost optimization.', highlights: ['50+ Faculty Delegates', '10 Lab Practicals', 'IBM & NVIDIA Guest Speakers'] },
  'llm-talk': { title: 'Expert Seminar: Scaling Large Language Models', category: 'UPCOMING TALK', meta: 'Oct 12, 2026 · TIET Auditorium', desc: 'Keynote on LLM alignment, LoRA/QLoRA fine-tuning, RAG evaluation benchmarks, and ethical AI deployment at scale.', highlights: ['AI Industry Lead Keynote', 'Live Q&A Session', 'Certificate of Participation'] },
  'stc-crypto': { title: 'STC: Modern Cryptography & Zero-Trust Security', category: 'COMPLETED STC', meta: 'Mar 02–06, 2026 · Cyber Security Lab', desc: 'Hands-on STC on post-quantum cryptographic primitives, zero-knowledge proofs, blockchain privacy, and network forensics.', highlights: ['Hands-on CTF Challenge', 'ZK Proof Demos', '100% Completion Rate'] },
  'open-day': { title: 'CSE Department Open Day & Innovation Expo', category: 'COMPLETED OPEN DAY', meta: 'Feb 18, 2026 · TIET Main Foyer', desc: 'Annual showcase featuring 120+ student projects, 15 industry judges, hardware demos, and innovation award ceremony.', highlights: ['120+ Projects Displayed', '15 Industry Judges', 'Awards Ceremony'] },
  'edge-stc': { title: 'STC: Embedded Intelligence & Edge Computing', category: 'UPCOMING STC', meta: 'Nov 20–24, 2026 · IoT Innovation Lab', desc: 'Training on deploying compressed neural nets onto ARM Cortex boards, TinyML, and real-time IoT sensor inference.', highlights: ['Free Hardware Kit Provided', 'C++/Python Lab Sessions', 'Limited to 40 Seats'] },
  'fdp-ai': { title: 'FDP: AI Tools & Generative Models for Educators', category: 'COMPLETED FDP', meta: 'Jan 06–10, 2026 · Smart Classroom Block', desc: '5-day FDP on AI-assisted pedagogy, ChatGPT, GitHub Copilot, and prompt engineering for curriculum design.', highlights: ['40+ Faculty Attended', 'Live Demo Sessions', 'Curriculum Design Workshop'] },
  'blockchain-talk': { title: 'Industry Talk: Decentralized Finance & Blockchain Security', category: 'COMPLETED SEMINAR', meta: 'Dec 04, 2025 · TIET Seminar Hall', desc: 'Keynote by fintech engineers on smart contracts, DeFi protocols, Web3 architecture, and regulatory compliance.', highlights: ['Industry Expert Keynote', 'Smart Contract Demo', 'Open Discussion Panel'] },
  'stc-ds': { title: 'STC: Applied Data Science & ML with Python', category: 'COMPLETED STC', meta: 'Nov 11–15, 2025 · Data Science Lab', desc: 'Intensive 5-day course on EDA, scikit-learn, XGBoost, model deployment with FastAPI, and MLOps fundamentals.', highlights: ['Hands-on Kaggle Competition', 'MLOps Pipeline Demo', 'FastAPI Deployment Lab'] }
};

function showEventDetails(id) {
  const d = eventDatabase[id];
  if (!d) return;
  const modal = document.getElementById('eventDetailModal');
  if (!modal) return;

  const pill = document.getElementById('modalCategoryPill');
  if (pill) {
    pill.innerText = d.category;
    if (d.category.toLowerCase().includes('completed')) {
      pill.className = 'category-pill completed';
    } else {
      pill.className = 'category-pill upcoming';
    }
  }

  document.getElementById('modalEventTitle').innerText = d.title;
  document.getElementById('modalEventMeta').innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${d.meta}`;
  document.getElementById('modalEventDesc').innerText = d.desc;
  document.getElementById('modalHighlights').innerHTML = '<h4 style="margin-bottom:12px"><i class="fa-solid fa-star" style="color:#d97706"></i> Key Highlights</h4><ul style="display:flex;flex-direction:column;gap:10px">' +
    d.highlights.map(h => `<li style="display:flex;gap:10px;font-size:0.92rem;color:var(--text-muted)"><i class="fa-solid fa-circle-check" style="color:var(--accent-cyan);margin-top:2px"></i><span>${h}</span></li>`).join('') + '</ul>';

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEventDetailModal() {
  const modal = document.getElementById('eventDetailModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* Poster Lightbox Viewer */
function openPosterLightbox(src, title) {
  let lightbox = document.getElementById('posterLightboxOverlay');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'posterLightboxOverlay';
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" onclick="closePosterLightbox()">&times;</button>
        <img src="" alt="" class="lightbox-img" id="posterLightboxImg">
        <p class="lightbox-caption" id="posterLightboxCaption"></p>
      </div>
    `;
    document.body.appendChild(lightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closePosterLightbox();
    });
  }

  const img = document.getElementById('posterLightboxImg');
  const cap = document.getElementById('posterLightboxCaption');
  if (img) img.src = src;
  if (cap) cap.innerText = title || 'Event Poster';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePosterLightbox() {
  const lightbox = document.getElementById('posterLightboxOverlay');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Setup Backdrop click & ESC listener for Event Details Modal and Poster Lightbox
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('eventDetailModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeEventDetailModal();
    });
  }
  
  // Attach click to all .event-img-wrap elements across events page
  document.querySelectorAll('.event-card').forEach(card => {
    const wrap = card.querySelector('.event-img-wrap');
    const img = wrap?.querySelector('img');
    const title = card.querySelector('.event-title')?.innerText || 'Event Poster';
    if (wrap && img) {
      wrap.addEventListener('click', () => {
        openPosterLightbox(img.src, title);
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEventDetailModal();
      closePosterLightbox();
    }
  });
});

/* --------------------------------------------------------------------------
   13. Toast Notification
   -------------------------------------------------------------------------- */
function showToast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  const icons = { success: 'fa-circle-check', error: 'fa-triangle-exclamation', info: 'fa-circle-info' };
  const colors = { success: '#10b981', error: '#ff007f', info: '#00f2fe' };
  t.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}" style="color:${colors[type] || colors.info}"></i> <span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(110%)'; setTimeout(() => t.remove(), 300); }, 3500);
}
