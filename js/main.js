const menuToggle = document.querySelector(".header__toggle");
const primaryNav = document.querySelector("#primary-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("header__nav--open", !isExpanded);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("header__nav--open");
  });
});

document.querySelectorAll(".pricing__option").forEach((button) => {
  button.addEventListener("click", () => {
    const period = button.dataset.period;
    document.querySelectorAll(".pricing__option").forEach((option) => {
      const active = option === button;
      option.classList.toggle("pricing__option--active", active);
      option.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll(".pricing__value").forEach((price) => {
      const amount = Number(price.dataset[period]);
      price.textContent = amount === 0 ? "$0" : `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
    });
    document.querySelectorAll(".pricing__period").forEach((label) => {
      label.textContent = period === "yearly" ? " / month, billed yearly" : " / month";
    });
  });
});

document.querySelectorAll(".faq__question").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
  });
});

document.querySelectorAll(".card--price [data-plan]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#plan").value = link.dataset.plan;
  });
});

document.querySelector("#signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = new FormData(form).get("name").trim();
  document.querySelector("#form-message").textContent = `Thanks, ${name}! Your AGYE OLIVER sign-up is ready. This demo form doesn't send your details.`;
  form.reset();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
