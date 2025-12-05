// --- testimonials in localStorage ---
const LS_KEY = "zsar-testimonials";

function loadTestimonials() {
  const raw = localStorage.getItem(LS_KEY);
  const list = raw ? JSON.parse(raw) : [];
  const container = document.getElementById("testimonials-list");

  if (!list.length) {
    container.innerHTML =
      '<div class="card"><p class="note small">No testimonials yet. Add one below to see how it will look.</p></div>';
    return;
  }

  container.innerHTML = list
    .map(
      (t) => `
      <article class="card">
        <div class="testimonial-header">
          <span class="testimonial-name">${t.name || "Anonymous"}</span>
          <span class="stars">${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</span>
        </div>
        <div class="testimonial-service">${t.service}</div>
        <div class="testimonial-text">“${t.feedback}”</div>
      </article>
    `
    )
    .join("");
}

function saveTestimonial(t) {
  const raw = localStorage.getItem(LS_KEY);
  const list = raw ? JSON.parse(raw) : [];
  list.unshift({ ...t, createdAt: new Date().toISOString() });
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

// --- rating stars ---
let currentRating = 0;

function setupStars() {
  const buttons = Array.from(document.querySelectorAll("#fb-stars button"));
  const ratingInput = document.getElementById("fb-rating");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = Number(btn.dataset.value);
      currentRating = value;
      ratingInput.value = String(value);

      buttons.forEach((b) => b.classList.toggle("active", Number(b.dataset.value) <= value));
    });
  });
}

// --- feedback form ---
function setupFeedbackForm() {
  const form = document.getElementById("feedback-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fb-name").value.trim();
    const service = document.getElementById("fb-service").value.trim();
    const rating = Number(document.getElementById("fb-rating").value);
    const feedback = document.getElementById("fb-text").value.trim();

    if (!rating || rating < 1 || rating > 5) {
      alert("Please choose a rating from 1 to 5 stars.");
      return;
    }

    saveTestimonial({ name, service, rating, feedback });
    form.reset();
    currentRating = 0;
    document.querySelectorAll("#fb-stars button").forEach((b) => b.classList.remove("active"));
    loadTestimonials();
  });
}

// --- contact form: opens mail draft ---
function setupContactForm() {
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("c-name").value.trim();
    const email = document.getElementById("c-email").value.trim();
    const msg = document.getElementById("c-message").value.trim();

    const subject = encodeURIComponent(`Paralegal enquiry from ${name || "website visitor"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
    window.location.href = `mailto:zsarfreelance@gmail.com?subject=${subject}&body=${body}`;
  });
}

// --- init ---
document.addEventListener("DOMContentLoaded", () => {
  setupStars();
  setupFeedbackForm();
  setupContactForm();
  loadTestimonials();
});
