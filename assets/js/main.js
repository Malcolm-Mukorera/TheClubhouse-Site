const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector("[data-nav-menu]");
const header = document.querySelector("[data-header]");
const navLinks = document.querySelectorAll(".nav-menu a");
const hero = document.querySelector(".hero");
const serviceButtons = document.querySelectorAll("[data-service]");
const serviceSelection = document.querySelector("[data-service-selection]");
const briefButtons = document.querySelectorAll("[data-brief]");
const briefPreview = document.querySelector("[data-brief-preview]");
const briefEmail = document.querySelector("[data-brief-email]");
const whatsappLink = document.querySelector("[data-whatsapp-link]");
const whatsappWidget = document.querySelector("[data-whatsapp-widget]");
const whatsappToggle = document.querySelector("[data-whatsapp-toggle]");
const whatsappPanel = document.querySelector("[data-whatsapp-panel]");
const copyWhatsappButton = document.querySelector("[data-copy-whatsapp]");
const copyStatus = document.querySelector("[data-copy-status]");
const feedGrid = document.querySelector("[data-social-feed]");
const feedStatus = document.querySelector("[data-feed-status]");
const feedFilters = document.querySelectorAll("[data-feed-filter]");
const whatsappNumber = "27614026217";
const whatsappDisplayNumber = "+27 61 402 6217";
let feedItems = [];
let activeFeedFilter = "all";

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

const fallbackFeedItems = [
  {
    platform: "instagram",
    type: "Posts & Reels",
    title: "Instagram feed ready",
    caption: "Connect Smillo's public Instagram Creator or Business account to show new posts and reels here automatically.",
    permalink: "#contact"
  },
  {
    platform: "tiktok",
    type: "Videos",
    title: "TikTok feed ready",
    caption: "Connect Smillo's TikTok account through the Display API to show his latest public videos here.",
    permalink: "#contact"
  }
];

const formatPlatform = (platform) => {
  if (platform === "instagram") {
    return "Instagram";
  }

  if (platform === "tiktok") {
    return "TikTok";
  }

  return "Social";
};

const renderFeed = () => {
  if (!feedGrid) {
    return;
  }

  const items = feedItems.length ? feedItems : fallbackFeedItems;
  const visibleItems = activeFeedFilter === "all"
    ? items
    : items.filter((item) => item.platform === activeFeedFilter);

  feedGrid.replaceChildren();

  visibleItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "feed-card";
    card.dataset.platform = item.platform || "social";

    const media = document.createElement("a");
    media.className = "feed-media";
    media.href = item.permalink || "#contact";
    if (item.permalink && item.permalink !== "#contact") {
      media.target = "_blank";
      media.rel = "noopener noreferrer";
    }

    if (item.thumbnail) {
      const image = document.createElement("img");
      image.src = item.thumbnail;
      image.alt = item.title || `${formatPlatform(item.platform)} post`;
      image.loading = "lazy";
      media.append(image);
    } else {
      const label = document.createElement("span");
      label.textContent = formatPlatform(item.platform);
      media.append(label);
    }

    const body = document.createElement("div");
    body.className = "feed-card-body";

    const meta = document.createElement("span");
    meta.className = "feed-meta";
    meta.textContent = `${formatPlatform(item.platform)} / ${item.type || "Update"}`;

    const title = document.createElement("h3");
    title.textContent = item.title || "Latest update";

    const caption = document.createElement("p");
    caption.textContent = item.caption || "Open this post on the original platform.";

    const link = document.createElement("a");
    link.href = item.permalink || "#contact";
    link.textContent = item.permalink === "#contact" ? "Connect feed" : "View post";
    if (item.permalink && item.permalink !== "#contact") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    body.append(meta, title, caption, link);
    card.append(media, body);
    feedGrid.append(card);
  });
};

const loadSocialFeed = async () => {
  if (!feedGrid) {
    return;
  }

  try {
    const response = await fetch("assets/data/social-feed.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Feed unavailable");
    }

    const feed = await response.json();
    feedItems = Array.isArray(feed.items) ? feed.items : [];

    if (feedStatus) {
      feedStatus.textContent = feed.connected
        ? `Live feed connected${feed.updatedAt ? ` / Updated ${feed.updatedAt}` : ""}.`
        : "Feeds are ready to connect. Instagram and TikTok authorization is still needed.";
    }
  } catch (error) {
    feedItems = [];

    if (feedStatus) {
      feedStatus.textContent = "Feeds are ready to connect. Add Instagram and TikTok API access to go live.";
    }
  }

  renderFeed();
};

const setWhatsappPanel = (isOpen) => {
  if (!whatsappWidget || !whatsappToggle || !whatsappPanel) {
    return;
  }

  whatsappWidget.classList.toggle("is-open", isOpen);
  whatsappToggle.setAttribute("aria-expanded", String(isOpen));
  whatsappPanel.setAttribute("aria-hidden", String(!isOpen));
};

const updateScrollState = () => {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
};

const updateActiveNav = () => {
  if (!navLinks.length) {
    return;
  }

  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href") || ""))
    .filter(Boolean);

  const passedSections = sections.filter((section) => section.getBoundingClientRect().top <= 130);
  const current = passedSections[passedSections.length - 1];

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", Boolean(current) && link.getAttribute("href") === `#${current.id}`);
  });
};

const setupRevealEffects = () => {
  const animatedItems = document.querySelectorAll(".section, .hero-content, .hero-proof");

  if (!animatedItems.length || !("IntersectionObserver" in window)) {
    animatedItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  document.body.classList.add("effects-ready");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  animatedItems.forEach((item) => observer.observe(item));
};

const setupHeroMotion = () => {
  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;

    hero.style.setProperty("--hero-shift-x", `${x}px`);
    hero.style.setProperty("--hero-shift-y", `${y}px`);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--hero-shift-x", "0");
    hero.style.setProperty("--hero-shift-y", "0");
  });
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

if (whatsappToggle) {
  whatsappToggle.addEventListener("click", () => {
    const isOpen = whatsappToggle.getAttribute("aria-expanded") === "true";
    setWhatsappPanel(!isOpen);
  });
}

if (copyWhatsappButton) {
  copyWhatsappButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(whatsappDisplayNumber);

      if (copyStatus) {
        copyStatus.textContent = "Number copied. You can paste it anywhere.";
      }
    } catch (error) {
      if (copyStatus) {
        copyStatus.textContent = whatsappDisplayNumber;
      }
    }
  });
}

document.addEventListener("click", (event) => {
  if (whatsappWidget && !whatsappWidget.contains(event.target)) {
    setWhatsappPanel(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setWhatsappPanel(false);
  }
});

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

if (feedFilters.length) {
  feedFilters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFeedFilter = button.getAttribute("data-feed-filter") || "all";
      feedFilters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderFeed();
    });
  });
}

updateContactLinks();
loadSocialFeed();
setupRevealEffects();
setupHeroMotion();
updateScrollState();
updateActiveNav();
window.addEventListener("scroll", () => {
  updateScrollState();
  updateActiveNav();
}, { passive: true });
