const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector("[data-nav-menu]");
const header = document.querySelector("[data-header]");
const navLinks = document.querySelectorAll(".nav-menu a");
const hero = document.querySelector(".hero");
const heroSlides = document.querySelectorAll("[data-hero-slide]");
const heroCopies = document.querySelectorAll("[data-hero-copy]");
const heroControls = document.querySelectorAll("[data-hero-control]");
const serviceButtons = document.querySelectorAll("[data-service]");
const serviceSelection = document.querySelector("[data-service-selection]");
const briefButtons = document.querySelectorAll("[data-brief]");
const briefPreview = document.querySelector("[data-brief-preview]");
const whatsappLink = document.querySelector("[data-whatsapp-link]");
const briefWhatsapps = document.querySelectorAll("[data-brief-whatsapp]");
const whatsappWidget = document.querySelector("[data-whatsapp-widget]");
const whatsappToggle = document.querySelector("[data-whatsapp-toggle]");
const whatsappPanel = document.querySelector("[data-whatsapp-panel]");
const copyWhatsappButton = document.querySelector("[data-copy-whatsapp]");
const copyStatus = document.querySelector("[data-copy-status]");
const feedGrid = document.querySelector("[data-social-feed]");
const feedStatus = document.querySelector("[data-feed-status]");
const feedFilters = document.querySelectorAll("[data-feed-filter]");
const talentProfileToggles = document.querySelectorAll(".talent-profile-toggle");
const talentGallery = document.querySelector("[data-talent-gallery]");
const talentGalleryFilters = document.querySelectorAll("[data-talent-gallery-filter]");
const talentGalleryItems = document.querySelectorAll("[data-talent-gallery-item]");
const talentGalleryImage = document.querySelector("[data-talent-gallery-image]");
const talentGalleryKicker = document.querySelector("[data-talent-gallery-kicker]");
const talentGalleryTitle = document.querySelector("[data-talent-gallery-title]");
const talentGalleryCount = document.querySelector("[data-talent-gallery-count]");
const talentGalleryPrev = document.querySelector("[data-talent-gallery-prev]");
const talentGalleryNext = document.querySelector("[data-talent-gallery-next]");
const whatsappNumber = "27614026217";
const whatsappDisplayNumber = "+27 61 402 6217";
let feedItems = [];
let activeFeedFilter = "all";
let activeHeroSlide = 0;
let heroTimer;
let activeTalentCategory = "all";
let activeTalentSlide = 0;

const selectedServices = new Set();
let selectedBrief = "Event booking";

const buildMessage = () => {
  const services = Array.from(selectedServices);
  const serviceText = services.length
    ? services.join(", ")
    : selectedBrief;

  return `Hi Smillo, I want to book: ${serviceText}. Date/location:`;
};

const updateContactLinks = () => {
  const message = buildMessage();
  const body = encodeURIComponent(message);

  if (briefPreview) {
    briefPreview.textContent = message;
  }

  if (whatsappLink instanceof HTMLAnchorElement) {
    whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${body}`;
  }

  briefWhatsapps.forEach((link) => {
    if (link instanceof HTMLAnchorElement) {
      link.href = `https://wa.me/${whatsappNumber}?text=${body}`;
    }
  });
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

  if (!visibleItems.length) {
    const empty = document.createElement("article");
    empty.className = "feed-empty";
    empty.textContent = `No ${formatPlatform(activeFeedFilter)} items are available yet.`;
    feedGrid.append(empty);
    return;
  }

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
    .map((link) => {
      const href = link.getAttribute("href") || "";
      return href.startsWith("#") ? document.querySelector(href) : null;
    })
    .filter(Boolean);

  const passedSections = sections.filter((section) => section.getBoundingClientRect().top <= 130);
  const current = passedSections[passedSections.length - 1];

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";

    if (href.startsWith("#")) {
      link.classList.toggle("is-active", Boolean(current) && href === `#${current.id}`);
    }
  });
};

const setupRevealEffects = () => {
  const animatedItems = document.querySelectorAll(".section, .hero-content, .hero-proof, .talent-hero-copy, .talent-hero-media");

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

const setHeroSlide = (index) => {
  if (!heroSlides.length) {
    return;
  }

  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeHeroSlide);
  });

  heroCopies.forEach((copy, copyIndex) => {
    copy.classList.toggle("is-active", copyIndex === activeHeroSlide);
  });

  heroControls.forEach((control, controlIndex) => {
    const isActive = controlIndex === activeHeroSlide;
    control.classList.toggle("is-active", isActive);
    control.setAttribute("aria-pressed", String(isActive));
  });
};

const startHeroSlideshow = () => {
  if (heroSlides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  window.clearInterval(heroTimer);
  heroTimer = window.setInterval(() => {
    setHeroSlide(activeHeroSlide + 1);
  }, 5200);
};

const setupHeroSlideshow = () => {
  if (!heroSlides.length) {
    return;
  }

  setHeroSlide(0);
  startHeroSlideshow();

  heroControls.forEach((control) => {
    control.addEventListener("click", () => {
      const index = Number(control.getAttribute("data-hero-control"));

      if (Number.isNaN(index)) {
        return;
      }

      setHeroSlide(index);
      startHeroSlideshow();
    });
  });
};

const getVisibleTalentItems = () => Array.from(talentGalleryItems).filter((item) => {
  const categories = item.getAttribute("data-category") || "";
  return activeTalentCategory === "all" || categories.split(" ").includes(activeTalentCategory);
});

const setTalentSlide = (index) => {
  if (!talentGallery || !talentGalleryImage) {
    return;
  }

  const visibleItems = getVisibleTalentItems();

  if (!visibleItems.length) {
    return;
  }

  activeTalentSlide = (index + visibleItems.length) % visibleItems.length;
  const activeItem = visibleItems[activeTalentSlide];
  const image = activeItem.querySelector("img");
  const src = activeItem.getAttribute("data-src");
  const alt = activeItem.getAttribute("data-alt") || "";
  const title = activeItem.getAttribute("data-title") || "Clubhouse Talent";
  const kicker = activeItem.getAttribute("data-kicker") || "Talent";

  if (src) {
    talentGalleryImage.src = src;
  }

  talentGalleryImage.alt = alt;
  talentGalleryImage.className = image?.className || "object-center";

  if (talentGalleryTitle) {
    talentGalleryTitle.textContent = title;
  }

  if (talentGalleryKicker) {
    talentGalleryKicker.textContent = kicker;
  }

  if (talentGalleryCount) {
    talentGalleryCount.textContent = `${activeTalentSlide + 1} / ${visibleItems.length}`;
  }

  talentGalleryItems.forEach((item) => {
    item.classList.toggle("is-active", item === activeItem);
  });
};

const setTalentCategory = (category) => {
  activeTalentCategory = category;
  activeTalentSlide = 0;

  talentGalleryFilters.forEach((button) => {
    const isActive = button.getAttribute("data-talent-gallery-filter") === category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  talentGalleryItems.forEach((item) => {
    const categories = item.getAttribute("data-category") || "";
    const isVisible = category === "all" || categories.split(" ").includes(category);
    item.hidden = !isVisible;
  });

  setTalentSlide(0);
};

const setupTalentGallery = () => {
  if (!talentGallery || !talentGalleryItems.length) {
    return;
  }

  talentGalleryFilters.forEach((button) => {
    button.addEventListener("click", () => {
      setTalentCategory(button.getAttribute("data-talent-gallery-filter") || "all");
    });
  });

  talentGalleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const visibleItems = getVisibleTalentItems();
      const index = visibleItems.indexOf(item);

      if (index >= 0) {
        setTalentSlide(index);
      }
    });
  });

  if (talentGalleryPrev) {
    talentGalleryPrev.addEventListener("click", () => {
      setTalentSlide(activeTalentSlide - 1);
    });
  }

  if (talentGalleryNext) {
    talentGalleryNext.addEventListener("click", () => {
      setTalentSlide(activeTalentSlide + 1);
    });
  }

  setTalentCategory(activeTalentCategory);
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
        button.setAttribute("aria-pressed", "false");
      } else {
        selectedServices.add(service);
        button.classList.add("is-selected");
        button.setAttribute("aria-pressed", "true");
      }

      const services = Array.from(selectedServices);
      serviceSelection.textContent = services.length
        ? `Ready: ${services.join(", ")}`
        : "Tap a service. Message Smillo.";
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
      briefButtons.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      updateContactLinks();
    });
  });
}

if (feedFilters.length) {
  feedFilters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFeedFilter = button.getAttribute("data-feed-filter") || "all";
      feedFilters.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      renderFeed();
    });
  });
}

if (talentProfileToggles.length) {
  talentProfileToggles.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".talent-profile-card");
      const details = card?.querySelector(".talent-profile-details");

      if (!details) {
        return;
      }

      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      details.hidden = isOpen;
      card.classList.toggle("is-open", !isOpen);
    });
  });
}

updateContactLinks();
loadSocialFeed();
setupRevealEffects();
setupHeroSlideshow();
setupTalentGallery();
setupHeroMotion();
updateScrollState();
updateActiveNav();
window.addEventListener("scroll", () => {
  updateScrollState();
  updateActiveNav();
}, { passive: true });
