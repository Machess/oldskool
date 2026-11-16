/* Oldschool website */

// Where contact messages are sent.
// Create a form at a form-forwarding service (for example Formspree), tell it
// to deliver to your Outlook address, and paste the form's URL here.
// Your email address stays inside that service: it never appears on this site.
// The form sends a POST with JSON: { "name": "...", "email": "...", "message": "..." }
// While this is empty, the form tells visitors it is not connected yet.
const CONTACT_ENDPOINT = '';

document.addEventListener('DOMContentLoaded', function () {
  setYear();
  setupMenu();
  setupContactForm();
  setupHeroQuestion();
  setupCarousels();
});

/* Footer year */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* Phone menu */
function setupMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-open'));
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });
}

/* Contact form */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameInput = form.elements.name;
  const emailInput = form.elements.email;
  const messageInput = form.elements.message;
  const trap = form.elements.website;
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-message');

  function say(text, isError) {
    status.textContent = text;
    status.classList.toggle('is-error', Boolean(isError));
  }

  function check(input, ok) {
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    const nameOk = check(nameInput, name.length > 0);
    const emailOk = check(emailInput, emailPattern.test(email));
    const messageOk = check(messageInput, message.length > 0);

    if (!nameOk || !emailOk || !messageOk) {
      say('Please fill in your name, a full email address and a message.', true);
      (!nameOk ? nameInput : !emailOk ? emailInput : messageInput).focus();
      return;
    }

    // A filled-in trap field means a spam robot: stop without sending.
    if (trap && trap.value) {
      form.reset();
      say('Thank you. Your message has been sent.', false);
      return;
    }

    if (!CONTACT_ENDPOINT) {
      say('The contact form is not connected yet. Please try again soon.', true);
      return;
    }

    button.disabled = true;
    say('Sending...', false);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: name, email: email, message: message })
      });
      if (!response.ok) throw new Error('Contact form failed: ' + response.status);
      form.reset();
      say('Thank you. Your message has been sent, and we will reply by email.', false);
    } catch (error) {
      say('That did not go through. Please try again in a moment.', true);
    } finally {
      button.disabled = false;
    }
  });
}

/* The sample question in the hero: calm feedback, no timers, try as often as you like */
function setupHeroQuestion() {
  const correct = '12';
  const guide = document.getElementById('guide-text');
  const fill = document.querySelector('.quest-fill');
  const answers = document.querySelectorAll('.answer');
  if (!guide || !answers.length) return;

  answers.forEach(function (button) {
    button.addEventListener('click', function () {
      if (button.dataset.answer === correct) {
        button.classList.add('is-right');
        answers.forEach(function (b) { b.disabled = true; });
        if (fill) fill.classList.add('is-done');
        guide.textContent = 'That is it! 7 + 5 = 12. The way is open.';
      } else {
        button.classList.add('is-wrong');
        button.disabled = true;
        guide.textContent = 'Not quite. Have another think. There is no hurry.';
      }
    });
  });
}

/* Game screens: one picture at a time, changed only by the arrows (no autoplay) */
function setupCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.carousel-frame img'));
    const count = carousel.querySelector('.carousel-count');
    if (slides.length < 2) return;
    let current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (img, i) { img.hidden = i !== current; });
      if (count) count.textContent = (current + 1) + ' / ' + slides.length;
    }

    carousel.querySelector('[data-prev]').addEventListener('click', function () { show(current - 1); });
    carousel.querySelector('[data-next]').addEventListener('click', function () { show(current + 1); });
  });
}
