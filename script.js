(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Data ----
  const secondary = '#8A6D3B';
  const primary = '#4B5320';
  const accent = '#E8B23D';

  const programma = [
    { ora: '15:00', evento: 'Apertura cancelli', nota: '', highlight: secondary },
    { ora: '16:00', evento: 'Cucina aperta + sottofondo musicale', nota: '', highlight: secondary },
    { ora: '18:00', evento: 'Gruppo Easy live', nota: '', highlight: secondary },
    { ora: '20:00', evento: 'DJ Ferro', nota: '', highlight: primary },
    { ora: '21:00', evento: 'Show Casera Italiana', nota: 'DJ + animazione + ballerini', highlight: primary },
    { ora: '22:00', evento: 'Main Event: Absolut 5 live', nota: '', highlight: accent },
    { ora: 'A seguire', evento: 'DJ set fino a notte', nota: '', highlight: accent },
  ];

  const highlights = [
    { icon: '🎸', title: 'Band live', desc: 'Absolut 5 sul palco come main event della serata.' },
    { icon: '🎧', title: '2 DJ prima fascia', desc: 'DJ Ferro e il resto del crew a scaldare la pista.' },
    { icon: '💃', title: 'Show con ballerini', desc: 'Animazione, VJ e led-wall per uno show a tutto ritmo.' },
    { icon: '🍝', title: 'Cucina aperta', desc: 'Si mangia dalle 16:00 fino a tardi, senza fretta.' },
    { icon: '🎁', title: 'Gadget in omaggio', desc: 'Un pensiero per chi partecipa alla festa.' },
    { icon: '🛍️', title: 'Mercatino', desc: 'Bancarelle e hobbisti per girare tra un ballo e l\'altro.' },
  ];

  const faqData = [
    { q: 'È gratuito?', a: 'Sì, l\'ingresso è gratuito. La pre-iscrizione ci serve solo per organizzarci al meglio.' },
    { q: 'Si mangia?', a: 'Sì, la cucina è aperta tutta la sera a partire dalle 16:00.' },
    { q: 'Posso portare il cane?', a: 'Gli animali sono benvenuti, tenuti al guinzaglio.' },
    { q: 'E se piove?', a: 'L\'evento si svolge anche con maltempo leggero. Aggiornamenti su Instagram in caso di annullamento.' },
    { q: 'Serve davvero pre-iscriversi?', a: 'Non è obbligatorio per entrare, ma ci aiuta tantissimo a stimare quante persone aspettarci.' },
  ];

  const marqueeBase = ['10 OTTOBRE 2026', 'CAPPELLA MAGGIORE (TV)', 'ABSOLUT 5 LIVE', 'INGRESSO GRATUITO'];

  // ---- Render: timeline ----
  const timelineEl = document.getElementById('timeline');
  timelineEl.innerHTML = programma.map((p) => `
    <li class="timeline-item">
      <div class="timeline-marker">
        <div class="timeline-dot" style="background:${p.highlight}; box-shadow:0 0 0 5px ${p.highlight}22;"></div>
        <div class="timeline-line"></div>
      </div>
      <div class="timeline-content">
        <div class="timeline-time" style="color:${p.highlight};">${p.ora}</div>
        <div class="timeline-event">${p.evento}</div>
        ${p.nota ? `<div class="timeline-note">${p.nota}</div>` : ''}
      </div>
    </li>
  `).join('');

  // ---- Render: highlights ----
  const highlightsGrid = document.getElementById('highlightsGrid');
  highlightsGrid.innerHTML = highlights.map((h) => `
    <div class="highlight-card">
      <div class="highlight-icon">${h.icon}</div>
      <div class="highlight-title">${h.title}</div>
      <div class="highlight-desc">${h.desc}</div>
    </div>
  `).join('');

  // ---- Render: sponsor placeholders ----
  const sponsorGrid = document.getElementById('sponsorGrid');
  sponsorGrid.innerHTML = Array.from({ length: 6 }).map(() =>
    `<div class="sponsor-slot">Il tuo logo</div>`
  ).join('');

  // ---- Render: marquee ----
  const marqueeTrack = document.getElementById('marqueeTrack');
  const marqueeItems = [...marqueeBase, ...marqueeBase, ...marqueeBase, ...marqueeBase];
  marqueeTrack.innerHTML = marqueeItems.map((m) =>
    `<span>${m} <span class="star">✦</span></span>`
  ).join('');

  // ---- Render: FAQ ----
  const faqList = document.getElementById('faqList');
  let openFaqIndex = 0;

  function renderFaq() {
    faqList.innerHTML = faqData.map((f, i) => {
      const open = openFaqIndex === i;
      return `
        <div class="faq-item">
          <button class="faq-question" data-index="${i}" aria-expanded="${open}">
            <span>${f.q}</span>
            <span class="faq-symbol">${open ? '−' : '+'}</span>
          </button>
          ${open ? `<div class="faq-answer">${f.a}</div>` : ''}
        </div>
      `;
    }).join('');

    faqList.querySelectorAll('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.getAttribute('data-index'));
        openFaqIndex = openFaqIndex === i ? -1 : i;
        renderFaq();
      });
    });
  }
  renderFaq();

  // ---- Scroll progress + header shrink ----
  const scrollProgress = document.getElementById('scrollProgress');
  const siteHeader = document.getElementById('siteHeader');

  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0;
    scrollProgress.style.width = `${pct}%`;
    siteHeader.classList.toggle('is-scrolled', h.scrollTop > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Reveal on scroll ----
  const revealEls = document.querySelectorAll('[data-reveal-id]');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-revealed'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => observer.observe(el));
  }

  // ---- Hero parallax ----
  const heroBg = document.getElementById('heroBg');
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      heroBg.style.transform = `translate(${x * 12}px, ${y * 10}px)`;
    });
  }

  // ---- Pre-registration form ----
  const signupForm = document.getElementById('signupForm');
  const confirmCard = document.getElementById('confirmCard');
  const confirmName = document.getElementById('confirmName');

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      nome: signupForm.nome.value.trim(),
      contatto: signupForm.contatto.value.trim(),
      adulti: Number(signupForm.adulti.value),
      bambini: Number(signupForm.bambini.value),
      nota: signupForm.nota.value.trim(),
    };

    // TODO: collegare a endpoint reale (Google Sheet / email / CRM) quando disponibile.
    // Per ora simuliamo l'invio e mostriamo la conferma.
    console.log('Pre-iscrizione (simulata):', formData);

    confirmName.textContent = formData.nome;
    signupForm.hidden = true;
    confirmCard.hidden = false;
  });
})();
