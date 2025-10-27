// small helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// year in footer
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- NAV - mobile toggle ---------- */
const hamburger = $('#hamburger');
const mainMenu = $('#mainMenu');

function toggleMenu() {
    mainMenu.classList.toggle('open');
    // aria
    const expanded = mainMenu.classList.contains('open');
    hamburger.setAttribute('aria-expanded', expanded);
}
hamburger.addEventListener('click', toggleMenu);
hamburger.addEventListener('keypress', (e) => { if (e.key === 'Enter') toggleMenu(); });

// close nav on outside click (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 720) {
        if (!$('nav.main-nav').contains(e.target) && mainMenu.classList.contains('open') && !hamburger.contains(e.target)) {
            mainMenu.classList.remove('open');
        }
    }
});



/* ---------- HERO video modal ---------- */
const videoModal = $('#videoModal');
const openVideo = $('#open-video');
const playHero = $('#playHero');
const closeModal = $('#closeModal');
const modalIframe = $('#modalIframe');
// set a default YouTube video (change to your sermon video ID)
const defaultVideoId = '6lt2JfJdGSY';

function openVideoModal(videoId = defaultVideoId) {
    modalIframe.src =
        'https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0';
    videoModal.style.display = 'flex';
    videoModal.setAttribute('aria-hidden', 'false');
    // trap focus
    closeModal.focus();
}
function closeVideoModal() {
    modalIframe.src = '';
    videoModal.style.display = 'none';
    videoModal.setAttribute('aria-hidden', 'true');
}
openVideo.addEventListener('click', () => openVideoModal());
playHero.addEventListener('click', () => openVideoModal(defaultVideoId));
closeModal.addEventListener('click', closeVideoModal);
// close modal on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.style.display === 'flex') closeVideoModal();
});

/* ---------- EVENTS CAROUSEL ---------- */
const track = $('#eventsTrack');
const nextEvent = $('#nextEvent');
const prevEvent = $('#prevEvent');

nextEvent.addEventListener('click', () => {
    track.scrollBy({ left: 280, behavior: 'smooth' });
});
prevEvent.addEventListener('click', () => {
    track.scrollBy({ left: -280, behavior: 'smooth' });
});

// allow horizontal touch scroll with inertia (native) - add subtle snap:
track.style.scrollSnapType = 'x mandatory';
$$('.event-card').forEach(card => card.style.scrollSnapAlign = 'center');

/* ---------- CONTACT FORM (front-end only) ---------- */
const connectForm = $('#connectForm');
const emailInput = $('#emailInput');
const nameInput = $('#nameInput');
const formMsg = $('#formMsg');

$('#subscribeBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        formMsg.style.display = 'block';
        formMsg.style.color = '#e24b4b';
        formMsg.textContent = 'Please enter a valid email address.';
        return;
    }
    // fake submit: show success message
    formMsg.style.display = 'block';
    formMsg.style.color = 'var(--accent-1)';
    formMsg.textContent = 'Thanks'
    { nameInput.value || '' } '!We will keep you posted.';
    // clear form after small delay
    setTimeout(() => {
        emailInput.value = '';
        nameInput.value = '';
    }, 800);

    // In a real site: POST to your newsletter API here
});

/* ---------- ACCESSIBILITY: focus outlines ---------- */
// show focus outlines only when navigating by keyboard
function handleFirstTab(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('show-focus');
        window.removeEventListener('keydown', handleFirstTab);
    }
}

window.addEventListener('keydown', handleFirstTab);