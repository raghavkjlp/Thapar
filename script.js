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
  const canvas = document.getElementById('quantumCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const numNodes = Math.min(Math.floor(width / 22), 60);
  const nodes = [];

  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#00f2fe' : '#7f00ff'
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = n.color;
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n.x - n2.x, dy = n.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(0,242,254,${1 - dist / 130})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
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
  const navMenu   = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  navMenu.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => navMenu.classList.remove('active'));
  });
}

/* --------------------------------------------------------------------------
   5. Theme Toggle
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const saved = localStorage.getItem('cs_theme') || 'dark';
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
  btn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem('cs_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem('cs_theme', 'light');
    }
    showToast('Theme switched!', 'info');
  });
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
            <img src="images/cs_catalyst_logo.jpg" alt="CS-CATALYST Logo">
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
            <li><a href="events.html#qbit"><i class="fa-solid fa-angle-right"></i> Q-BIT 2026 Workshop</a></li>
            <li><a href="team.html"><i class="fa-solid fa-angle-right"></i> Faculty &amp; Team</a></li>
            <li><a href="apply.html"><i class="fa-solid fa-angle-right"></i> Apply for Panel</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Faculty Leadership</h4>
          <div class="coord-mini-contact">
            <p><strong>Mr. Neeraj Kumar</strong><br>Head of Department — CSE</p>
            <p><strong>Dr. Sandeep Verma</strong><br>Assistant Professor — CS-CATALYST Coordinator</p>
            <p><i class="fa-solid fa-building-columns"></i> Department of CSE, TIET, Patiala — 147004</p>
          </div>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <p class="contact-info"><i class="fa-solid fa-location-dot"></i> Activity Space-2 / Academic Block, Thapar Institute, Patiala, Punjab — 147004</p>
          <p class="contact-info"><i class="fa-solid fa-envelope"></i> cscatalyst@thapar.edu</p>
          <div class="social-icons">
            <a href="#" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="#" title="Twitter / X"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="#" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" title="GitHub"><i class="fa-brands fa-github"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 CS-CATALYST Society &bull; Department of Computer Science &amp; Engineering, Thapar Institute of Engineering &amp; Technology (Deemed University), Patiala. All Rights Reserved.</p>
      </div>
    </div>
  </footer>`;
}

/* --------------------------------------------------------------------------
   7. Events Gallery Filter & Search (events.html)
   -------------------------------------------------------------------------- */
function initEventFilters() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const eventCards  = document.querySelectorAll('.event-card');
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
  const toggle  = document.getElementById('respToggle');
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
  const zone    = document.getElementById('fileDropZone');
  const input   = document.getElementById('resumeFileInput');
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
    if (display) display.innerHTML = `<i class="fa-solid fa-file-pdf" style="color:#ff007f"></i> <strong>${file.name}</strong> (${(file.size/1024).toFixed(1)} KB)`;
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
    const name     = document.getElementById('fullName').value.trim();
    const terms    = document.getElementById('agreeTerms').checked;
    const fileEl   = document.getElementById('resumeFileInput');

    if (!terms) { showToast('Please agree to the member responsibilities.', 'error'); return; }
    if (!fileEl?.files?.length) { showToast('Please attach your resume PDF.', 'error'); return; }

    const ref = 'CSC-2026-' + Math.floor(10000 + Math.random() * 90000);
    const data = {
      ref, name,
      roll:   document.getElementById('rollNo').value.trim(),
      year:   document.getElementById('yearSemester').value,
      email:  document.getElementById('emailAddr').value.trim(),
      phone:  document.getElementById('phoneNo').value.trim(),
      domain: document.getElementById('primaryDomain').value,
      sop:    document.getElementById('sopText').value.trim(),
      file:   fileEl.files[0].name,
      at:     new Date().toISOString()
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
  'cloud-fdp':       { title: 'National FDP on Cloud Infrastructure & HPC Architectures', category: 'COMPLETED FDP', meta: 'May 14–18, 2026 · CSE Computer Lab 3', desc: '5-Day Faculty Development Program delivered by leading HPC researchers. Topics: Kubernetes, GPU acceleration, parallel MPI, cloud cost optimization.', highlights: ['50+ Faculty Delegates','10 Lab Practicals','IBM & NVIDIA Guest Speakers'] },
  'llm-talk':        { title: 'Expert Seminar: Scaling Large Language Models', category: 'UPCOMING TALK', meta: 'Oct 12, 2026 · TIET Auditorium', desc: 'Keynote on LLM alignment, LoRA/QLoRA fine-tuning, RAG evaluation benchmarks, and ethical AI deployment at scale.', highlights: ['AI Industry Lead Keynote','Live Q&A Session','Certificate of Participation'] },
  'stc-crypto':      { title: 'STC: Modern Cryptography & Zero-Trust Security', category: 'COMPLETED STC', meta: 'Mar 02–06, 2026 · Cyber Security Lab', desc: 'Hands-on STC on post-quantum cryptographic primitives, zero-knowledge proofs, blockchain privacy, and network forensics.', highlights: ['Hands-on CTF Challenge','ZK Proof Demos','100% Completion Rate'] },
  'open-day':        { title: 'CSE Department Open Day & Innovation Expo', category: 'COMPLETED OPEN DAY', meta: 'Feb 18, 2026 · TIET Main Foyer', desc: 'Annual showcase featuring 120+ student projects, 15 industry judges, hardware demos, and innovation award ceremony.', highlights: ['120+ Projects Displayed','15 Industry Judges','Awards Ceremony'] },
  'edge-stc':        { title: 'STC: Embedded Intelligence & Edge Computing', category: 'UPCOMING STC', meta: 'Nov 20–24, 2026 · IoT Innovation Lab', desc: 'Training on deploying compressed neural nets onto ARM Cortex boards, TinyML, and real-time IoT sensor inference.', highlights: ['Free Hardware Kit Provided','C++/Python Lab Sessions','Limited to 40 Seats'] },
  'fdp-ai':          { title: 'FDP: AI Tools & Generative Models for Educators', category: 'COMPLETED FDP', meta: 'Jan 06–10, 2026 · Smart Classroom Block', desc: '5-day FDP on AI-assisted pedagogy, ChatGPT, GitHub Copilot, and prompt engineering for curriculum design.', highlights: ['40+ Faculty Attended','Live Demo Sessions','Curriculum Design Workshop'] },
  'blockchain-talk': { title: 'Industry Talk: Decentralized Finance & Blockchain Security', category: 'COMPLETED SEMINAR', meta: 'Dec 04, 2025 · TIET Seminar Hall', desc: 'Keynote by fintech engineers on smart contracts, DeFi protocols, Web3 architecture, and regulatory compliance.', highlights: ['Industry Expert Keynote','Smart Contract Demo','Open Discussion Panel'] },
  'stc-ds':          { title: 'STC: Applied Data Science & ML with Python', category: 'COMPLETED STC', meta: 'Nov 11–15, 2025 · Data Science Lab', desc: 'Intensive 5-day course on EDA, scikit-learn, XGBoost, model deployment with FastAPI, and MLOps fundamentals.', highlights: ['Hands-on Kaggle Competition','MLOps Pipeline Demo','FastAPI Deployment Lab'] }
};

function showEventDetails(id) {
  const d = eventDatabase[id];
  if (!d) return;
  document.getElementById('modalCategoryPill').innerText = d.category;
  document.getElementById('modalEventTitle').innerText = d.title;
  document.getElementById('modalEventMeta').innerHTML = `<i class="fa-solid fa-calendar"></i> ${d.meta}`;
  document.getElementById('modalEventDesc').innerText = d.desc;
  document.getElementById('modalHighlights').innerHTML = '<h4 style="margin-bottom:12px"><i class="fa-solid fa-star" style="color:#fbbf24"></i> Key Highlights</h4><ul style="display:flex;flex-direction:column;gap:8px">' +
    d.highlights.map(h => `<li style="display:flex;gap:8px;font-size:0.9rem;color:#94a3b8"><i class="fa-solid fa-check" style="color:#00f2fe;margin-top:3px"></i>${h}</li>`).join('') + '</ul>';
  document.getElementById('eventDetailModal')?.classList.add('active');
}
function closeEventDetailModal() {
  document.getElementById('eventDetailModal')?.classList.remove('active');
}

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
