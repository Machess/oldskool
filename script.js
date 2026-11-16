/* Oldskool launch page */

// Where sign-ups are sent. Paste the form URL from your mailing-list service
// (Mailchimp, Buttondown, Formspree, your own server...). It receives a POST
// with JSON: { "email": "parent@example.com" }.
// While this is empty, the form tells visitors that sign-up is not open yet.
const SIGNUP_ENDPOINT = '';

document.addEventListener('DOMContentLoaded', function () {
  setYear();
  setupMenu();
  setupSignupForms();
  setupHeroQuestion();
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

/* Email sign-up */
function setupSignupForms() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.querySelectorAll('.signup-form').forEach(function (form) {
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector('.form-message');

    function say(text, isError) {
      message.textContent = text;
      message.classList.toggle('is-error', Boolean(isError));
      input.setAttribute('aria-invalid', isError ? 'true' : 'false');
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const email = input.value.trim();

      if (!emailPattern.test(email)) {
        say('Please enter a full email address, like you@example.com.', true);
        input.focus();
        return;
      }

      if (!SIGNUP_ENDPOINT) {
        say('Sign-up is not open yet. Please check back soon.', true);
        return;
      }

      button.disabled = true;
      say('Sending...', false);

      try {
        const response = await fetch(SIGNUP_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: email })
        });
        if (!response.ok) throw new Error('Sign-up failed: ' + response.status);
        form.reset();
        say('You are on the list. We will write once, on launch day.', false);
      } catch (error) {
        say('That did not go through. Please try again in a moment.', true);
      } finally {
        button.disabled = false;
      }
    });
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
