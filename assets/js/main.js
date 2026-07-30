const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector("[data-nav-menu]");
const serviceButtons = document.querySelectorAll("[data-service]");
const serviceSelection = document.querySelector("[data-service-selection]");
const briefButtons = document.querySelectorAll("[data-brief]");
const briefPreview = document.querySelector("[data-brief-preview]");
const briefEmail = document.querySelector("[data-brief-email]");
const whatsappLink = document.querySelector("[data-whatsapp-link]");
const whatsappNumber = "27614026217";

const selectedServices = new Set();
let selectedBrief = "Corporate event";

const buildMessage = () => {
  const services = Array.from(selectedServices);
  const serviceText = services.length
    ? ` I am interested in: ${services.join(", ")}.`
    : "";

  return `Hi The Clubhouse, I would like to discuss a ${selectedBrief.toLowerCase()}.${serviceText}`;
};

const updateContactLinks = () => {
  const message = buildMessage();
  const subject = encodeURIComponent("The Clubhouse Event Enquiry");
  const body = encodeURIComponent(message);

  if (briefPreview) {
    briefPreview.textContent = message;
  }

  if (briefEmail instanceof HTMLAnchorElement) {
    briefEmail.href = `mailto:info@theclubhouse.co.za?subject=${subject}&body=${body}`;
  }

  if (whatsappLink instanceof HTMLAnchorElement) {
    whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${body}`;
  }
};

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  menu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    }
  });
}

if (serviceButtons.length && serviceSelection) {
  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const service = button.getAttribute("data-service");

      if (!service) {
        return;
      }

      if (selectedServices.has(service)) {
        selectedServices.delete(service);
        button.classList.remove("is-selected");
      } else {
        selectedServices.add(service);
        button.classList.add("is-selected");
      }

      const services = Array.from(selectedServices);
      serviceSelection.textContent = services.length
        ? `Selected: ${services.join(", ")}`
        : "Select services to build a quick enquiry.";
      updateContactLinks();
    });
  });
}

if (briefButtons.length) {
  briefButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const brief = button.getAttribute("data-brief");

      if (!brief) {
        return;
      }

      selectedBrief = brief;
      briefButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      updateContactLinks();
    });
  });
}

updateContactLinks();
