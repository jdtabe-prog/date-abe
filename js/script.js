/* DATE ABE v2 — light flourishes only. Site fails open with JS off. */

// ---- splash: NO dodges, then genuinely gives in and works ----
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
let dodges = 0;

function goNext() {
  document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}
btnYes?.addEventListener('click', goNext);

function dodge(e) {
  if (dodges >= 4) return; // converted — let the real click through
  e.preventDefault();
  e.stopPropagation();
  dodges++;
  if (dodges >= 4) {
    // give in: strip the gag entirely so the next tap ALWAYS works
    btnNo.removeEventListener('pointerenter', dodge);
    btnNo.removeEventListener('touchstart', dodge);
    btnNo.removeEventListener('click', dodge, true);
    btnNo.textContent = 'Fine. Go on then';
    btnNo.style.transform = '';
    btnNo.addEventListener('click', goNext);
    return;
  }
  const dx = (Math.random() - 0.5) * Math.min(window.innerWidth * 0.5, 240);
  const dy = (Math.random() - 0.7) * 140;
  btnNo.style.transform = `translate(${dx}px, ${dy}px) rotate(${(Math.random() - 0.5) * 12}deg)`;
}
btnNo?.addEventListener('pointerenter', dodge);
btnNo?.addEventListener('touchstart', dodge, { passive: false });
btnNo?.addEventListener('click', dodge, true);

// ---- ticker: duplicate content for seamless loop, cupids between items ----
const tickerInner = document.getElementById('tickerInner');
if (tickerInner) {
  const items = [...tickerInner.querySelectorAll('span')].map(s => s.outerHTML);
  const withCupids = items.map(i => i + '<i class="tick-cupid"></i>').join('');
  tickerInner.innerHTML = withCupids + withCupids;
}

// ---- carousel arrows ----
const car = document.getElementById('carousel');
const step = () => car.querySelector('img').getBoundingClientRect().width + 12;
document.getElementById('carPrev')?.addEventListener('click', () => car.scrollBy({ left: -step(), behavior: 'smooth' }));
document.getElementById('carNext')?.addEventListener('click', () => car.scrollBy({ left: step(), behavior: 'smooth' }));

// ---- cookie gag: banner appears when candidate section arrives; monster eats it ----
const cookiebar = document.getElementById('cookiebar');
const monster = document.getElementById('monster');
let cookieShown = false;
const cookieIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting && !cookieShown) {
      cookieShown = true;
      setTimeout(() => { cookiebar.hidden = false; }, 900);
      cookieIO.disconnect();
    }
  });
}, { threshold: 0.4 });
const aboutPanel = document.getElementById('about');
if (aboutPanel) cookieIO.observe(aboutPanel);

function eatCookie() {
  monster.hidden = false;
  requestAnimationFrame(() => {
    monster.classList.add('up');
    setTimeout(() => {
      monster.classList.add('chomp');
      cookiebar.classList.add('eaten');
    }, 480);
    setTimeout(() => {
      cookiebar.hidden = true;
      monster.classList.remove('up', 'chomp');
    }, 1500);
    setTimeout(() => { monster.hidden = true; }, 2100);
  });
}
document.getElementById('cookieAccept')?.addEventListener('click', eatCookie);
document.getElementById('cookieAccept2')?.addEventListener('click', eatCookie);

// ---- voice note testimonial ----
const vn = document.getElementById('voiceNote');
const vnPlay = document.getElementById('vnPlay');
const vnTime = document.getElementById('vnTime');
if (vn && vnPlay) {
  const audio = new Audio('assets/audio/testimonial.mp3');
  let ready = false, failed = false;
  audio.addEventListener('canplaythrough', () => { ready = true; }, { once: true });
  audio.addEventListener('error', () => { failed = true; }, { once: true });
  const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  audio.addEventListener('loadedmetadata', () => { vnTime.textContent = fmt(audio.duration); });
  audio.addEventListener('timeupdate', () => { vnTime.textContent = fmt(audio.currentTime); });
  audio.addEventListener('ended', () => {
    vn.classList.remove('playing');
    vnPlay.querySelector('.vn-icon').innerHTML = '&#9654;';
    vnTime.textContent = fmt(audio.duration);
  });
  vnPlay.addEventListener('click', () => {
    if (failed) { vnTime.textContent = 'recording…'; return; }
    if (audio.paused) {
      audio.play().then(() => {
        vn.classList.add('playing');
        vnPlay.querySelector('.vn-icon').innerHTML = '&#10073;&#10073;';
      }).catch(() => { vnTime.textContent = 'recording…'; });
    } else {
      audio.pause();
      vn.classList.remove('playing');
      vnPlay.querySelector('.vn-icon').innerHTML = '&#9654;';
    }
  });
}

// ---- scroll reveals ----
const revealables = document.querySelectorAll('.eyebrow,.display,.body-copy,.badge,.quote,.price-card,.faq details,.map,.seen-on,.carousel-wrap');
revealables.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
revealables.forEach(el => io.observe(el));

// ---- contact form via Formspree ----
const form = document.getElementById('enquiryForm');
const status = document.getElementById('formStatus');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Processing…';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      form.reset();
      status.textContent = 'Received. Abe has been notified and is playing it cool.';
    } else {
      status.textContent = 'Something broke. Try again, or just shout across London Fields.';
    }
  } catch {
    status.textContent = 'Network wobble. Try again in a sec.';
  }
});

// ---- tile pinning: only panels that fit the viewport get the flick ----
function setPins() {
  document.querySelectorAll('.panel').forEach(p => {
    p.classList.remove('pin');
    if (p.scrollHeight <= window.innerHeight + 8) p.classList.add('pin');
  });
}
setPins();
addEventListener('resize', setPins);
addEventListener('load', setPins);

// ---- year ----
document.getElementById('year').textContent = new Date().getFullYear();
