(() => {
  "use strict";
  const root = document.documentElement;
  root.classList.add("js");

  const themeButton = document.getElementById("theme");
  if (themeButton) {
    const updateThemeButton = () => {
      themeButton.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
    };
    updateThemeButton();
    themeButton.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (_) {}
      updateThemeButton();
    });
  }

  const menuButton = document.getElementById("menu");
  const nav = document.getElementById("nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open", !expanded);
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.focus();
      }
    });
  }

  const year = document.getElementById("yr");
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById("cf");
  if (form) {
    const rules = {
      name: value => value.trim().length >= 2 || "Enter at least 2 characters for your name.",
      email: value => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(value.trim()) || "Enter a valid email address.",
      subject: value => value.trim().length >= 3 || "Enter a subject with at least 3 characters.",
      message: value => value.trim().length >= 10 || "Enter a message with at least 10 characters."
    };
    const fields = [...form.querySelectorAll("input, textarea")];
    const validate = field => {
      const result = rules[field.name](field.value);
      const valid = result === true;
      const error = document.getElementById(`${field.id}-err`);
      field.setAttribute("aria-invalid", String(!valid));
      error.hidden = valid;
      error.textContent = valid ? "" : result;
      return valid;
    };
    fields.forEach(field => {
      field.addEventListener("blur", () => validate(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validate(field);
      });
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      const invalid = fields.filter(field => !validate(field));
      const status = document.getElementById("st");
      if (invalid.length) {
        status.className = "st bad";
        status.textContent = `Please correct ${invalid.length} field(s) and try again.`;
        invalid[0].focus();
        return;
      }
      const values = Object.fromEntries(new FormData(form));
      status.className = "st ok";
      status.textContent = "Your default email application is opening. Review and send the message there.";
      const recipient = "YOUR_EMAIL_ADDRESS@example.com"; // Replace with your real email address.
      const body = `${values.message}\\n\\nFrom: ${values.name}\\nReply email: ${values.email}`;
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
    });
  }
})();