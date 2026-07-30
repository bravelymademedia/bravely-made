const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const modal = document.querySelector("[data-video-modal]");
const videoFrame = document.querySelector("[data-video-frame]");
const modalClose = document.querySelector("[data-modal-close]");
const contactForm = document.querySelector("[data-contact-form]");

// Add a background to the navigation once it leaves the hero's top edge.
function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 30);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// Mobile navigation.
menuButton.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("modal-open", isOpen);
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("modal-open");
  });
});

// Reveal sections gently as they enter the screen.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

// Open portfolio films without sending the visitor away from the page.
document.querySelectorAll("[data-video]").forEach((button) => {
  button.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = button.dataset.video;
    iframe.title = button.dataset.title;
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;

    videoFrame.replaceChildren(iframe);
    modal.showModal();
    document.body.classList.add("modal-open");
  });
});

function closeVideo() {
  modal.close();
  videoFrame.replaceChildren();
  document.body.classList.remove("modal-open");
}

modalClose.addEventListener("click", closeVideo);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeVideo();
  }
});
modal.addEventListener("close", () => {
  videoFrame.replaceChildren();
  document.body.classList.remove("modal-open");
});

// A static website cannot send email by itself, so this prepares a message
// in the visitor's preferred email app.
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const project = formData.get("project");
  const subject = encodeURIComponent(`Project inquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nProject details:\n${project}`
  );

  window.location.href =
    `mailto:bravelymademedia@gmail.com?subject=${subject}&body=${body}`;
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
