/* DATE ABE — light flourishes only. Site fails open with JS off. */

// splash gag
const splash = document.getElementById('splash');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
let dodges = 0;

function dismissSplash() {
  splash.classList.add('dismissed');
  document.body.style.overflow = '';
  setTimeout(showCookie, 1600);
}
if (splash) {
  document.body.style.overflow = 'hidden';
  btnYes.addEventListener('click', dismissSplash);

  const dodge = (e) => {
    e.preventDefault();
    dodges++;
    if (dodges >= 4) {
      btnNo.textContent = 'Fine. Yes';
      btnNo.style.transform = '';
      btnNo.onclick = dismissSplash;
      return;
    }
    const dx = (Math.random() - 0.5) * (window.innerWidth * 0.55);
    const dy = (Math.random() - 0.7) * 160;
    btnNo.style.transform = `translate(${dx}px, ${dy}px) rotate(${(Math.random()-0.5)*14}deg)`;
  };
  btnNo.addEventListener('pointerenter', dodge);
  btnNo.addEventListener('touchstart', dodge, { passive: false });
  btnNo.addEventListener('click', dodge);
}

// cookie parody
const cookiebar = document.getElementById('cookiebar');
function showCookie() {
  if (!cookiebar || cookiebar.dataset.done) return;
  cookiebar.hidden = false;
}
function hideCookie(msg) {
  cookiebar.dataset.done = '1';
  cookiebar.innerHTML = '<p>' + msg + '</p>';
  setTimeout(() => { cookiebar.hidden = true; }, 2200);
}
document.getElementById('cookieAccept')?.addEventListener('click', () =>
  hideCookie('Noted. He prefers them slightly underbaked. 🍪'));
document.getElementById('cookieAccept2')?.addEventListener('click', () =>
  hideCookie('Reluctance logged and forgiven.'));

// scroll reveals
const revealables = document.querySelectorAll('.eyebrow,.display,.body-copy,.fact-card,.quote,.price-card,.badge,.link-card,.timeline li,.faq details,.map');
revealables.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.15 });
revealables.forEach(el => io.observe(el));

// contact form via Formspree (AJAX; falls back to normal POST without JS)
const form = document.getElementById('enquiryForm');
const status = document.getElementById('formStatus');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Processing enquiry…';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      form.reset();
      status.textContent = 'Enquiry received. Abe has been notified and is playing it cool.';
    } else {
      status.textContent = 'Something broke. Try again, or just shout across London Fields.';
    }
  } catch {
    status.textContent = 'Network wobble. Try again in a sec.';
  }
});

// year
document.getElementById('year').textContent = new Date().getFullYear();
