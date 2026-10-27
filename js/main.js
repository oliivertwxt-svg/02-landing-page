/**
 * Initializes the page once its markup is ready.
 */
const init = () => {
  initMobileMenu();
  initAccordion();
  initPricingToggle();
  initHeaderShadow();
  initPlanSelection();
  initSignupForm();
  setFooterYear();
};

/**
 * Toggles the mobile navigation and closes it after navigation or Escape.
 */
const initMobileMenu = () => {
  const menuToggle = document.querySelector(".header__toggle");
  const primaryNav = document.querySelector("#primary-nav");

  const setMenuOpen = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    primaryNav.classList.toggle("header__nav--open", isOpen);
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
};

/**
 * Keeps FAQ answers mutually exclusive and updates their accessible state.
 */
const initAccordion = () => {
  document.querySelectorAll(".faq__question").forEach((button) => {
    button.addEventListener("click", () => {
      const willExpand = button.getAttribute("aria-expanded") !== "true";

      document.querySelectorAll(".faq__question").forEach((question) => {
        const isExpanded = question === button && willExpand;
        const panel = document.getElementById(question.getAttribute("aria-controls"));

        question.setAttribute("aria-expanded", String(isExpanded));
        panel.classList.toggle("faq__answer--open", isExpanded);
        panel.setAttribute("aria-hidden", String(!isExpanded));
        panel.toggleAttribute("inert", !isExpanded);
      });
    });
  });
};

/**
 * Updates displayed plan prices and the yearly savings label.
 */
const initPricingToggle = () => {
  const options = document.querySelectorAll(".pricing__option");
  const prices = document.querySelectorAll(".pricing__value");
  const periods = document.querySelectorAll(".pricing__period");
  const savings = document.querySelector(".pricing__savings");

  options.forEach((button) => {
    button.addEventListener("click", () => {
      const period = button.dataset.period;

      options.forEach((option) => {
        const isActive = option === button;
        option.classList.toggle("pricing__option--active", isActive);
        option.setAttribute("aria-pressed", String(isActive));
      });

      prices.forEach((price) => {
        const amount = Number(price.dataset[period]);
        price.textContent = amount === 0 ? "$0" : `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
      });

      periods.forEach((label) => {
        label.textContent = period === "yearly" ? " / month, billed yearly" : " / month";
      });

      savings.hidden = period !== "yearly";
    });
  });
};

/**
 * Adds a shadow to the sticky header after the page scrolls.
 */
const initHeaderShadow = () => {
  const header = document.querySelector(".header");

  const updateHeaderShadow = () => {
    header.classList.toggle("header--scrolled", window.scrollY > 10);
  };

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();
};

/**
 * Copies the selected pricing tier into the signup form.
 */
const initPlanSelection = () => {
  document.querySelectorAll(".card--price [data-plan]").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelector("#plan").value = link.dataset.plan;
    });
  });
};

/**
 * Displays a local confirmation when the demo signup form is submitted.
 */
const initSignupForm = () => {
  document.querySelector("#signup-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = new FormData(form).get("name").trim();

    document.querySelector("#form-message").textContent = `Thanks, ${name}! Your AGYE OLIVER sign-up is ready. This demo form doesn't send your details.`;
    form.reset();
  });
};

/**
 * Keeps the copyright year current.
 */
const setFooterYear = () => {
  document.querySelector("#current-year").textContent = new Date().getFullYear();
};

document.addEventListener("DOMContentLoaded", init);
