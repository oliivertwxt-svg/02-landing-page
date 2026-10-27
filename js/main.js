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
 * Validates signups, prevents duplicate emails, and stores successful entries locally.
 */
const initSignupForm = () => {
  const form = document.querySelector("#signup-form");
  const message = document.querySelector("#form-message");
  const nameInput = form.querySelector("#full-name");
  const emailInput = form.querySelector("#email");
  const planInput = form.querySelector("#plan");
  const termsInput = form.querySelector("#terms");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const fields = [
    { input: nameInput, error: document.querySelector("#name-error"), validate: () => nameInput.value.trim().length >= 2, message: "Please enter a name with at least 2 characters." },
    { input: emailInput, error: document.querySelector("#email-error"), validate: () => emailPattern.test(emailInput.value.trim()), message: "Please enter a valid email address." },
    { input: planInput, error: document.querySelector("#plan-error"), validate: () => planInput.value !== "", message: "Please choose a plan." },
    { input: termsInput, error: document.querySelector("#terms-error"), validate: () => termsInput.checked, message: "Please agree to the terms to continue." }
  ];

  const clearError = (field) => {
    field.input.removeAttribute("aria-invalid");
    field.error.textContent = "";
  };

  const validateField = (field) => {
    const isValid = field.validate();
    field.input.setAttribute("aria-invalid", String(!isValid));
    field.error.textContent = isValid ? "" : field.message;
    return isValid;
  };

  fields.forEach((field) => {
    const eventName = field.input.type === "checkbox" || field.input.tagName === "SELECT" ? "change" : "input";

    field.input.addEventListener(eventName, () => {
      if (field.input.hasAttribute("aria-invalid")) {
        validateField(field);
      }
      message.textContent = "";
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = fields.map(validateField).every(Boolean);
    if (!isValid) {
      message.textContent = "";
      fields.find((field) => field.input.getAttribute("aria-invalid") === "true").input.focus();
      return;
    }

    const signup = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      plan: planInput.value,
      createdAt: new Date().toISOString()
    };

    try {
      const savedSignups = JSON.parse(localStorage.getItem("signups") || "[]");
      if (!Array.isArray(savedSignups)) {
        throw new Error('Stored "signups" data must be an array.');
      }

      const emailExists = savedSignups.some((entry) =>
        entry && typeof entry.email === "string" && entry.email.trim().toLowerCase() === signup.email.toLowerCase()
      );
      if (emailExists) {
        message.textContent = "You've already signed up";
        return;
      }

      localStorage.setItem("signups", JSON.stringify([...savedSignups, signup]));
    } catch (error) {
      console.error("Unable to save signup to localStorage.", error);
      message.textContent = "We couldn't save your signup in this browser. Please check your storage settings and try again.";
      return;
    }

    form.reset();
    fields.forEach(clearError);
    message.textContent = `Thanks, ${signup.name}! Your sign-up is saved in this browser.`;
  });
};

/**
 * Keeps the copyright year current.
 */
const setFooterYear = () => {
  document.querySelector("#current-year").textContent = new Date().getFullYear();
};

document.addEventListener("DOMContentLoaded", init);
