/**
 * Portfolio project data — single source of truth.
 * Visual sequence order is intentional.
 */
window.PORTFOLIO_PROJECTS = [
  {
    id: "01",
    slug: "acm",
    name: "ACM – Werbeagentur GmbH",
    category: "Advertising / Creative Agency",
    country: "Germany",
    year: "2026",
    url: "https://acmonlinewerbung.com/",
    tags: ["Advertising", "Germany", "Performance"],
    summary:
      "A structured website for a German advertising agency — clear service narrative, compositional restraint and a conversion-aware landing experience.",
    meta: ["Web Design", "Frontend", "Responsive UI"],
  },
  {
    id: "02",
    slug: "advisor-ad-service",
    name: "Advisor Ad Service LLP",
    category: "Advertising / Paid Media",
    country: "USA",
    year: "2026",
    url: "https://adserviceadvisor.com/",
    tags: ["Paid Media", "USA", "Strategy"],
    summary:
      "A performance-oriented advertising advisory site — system clarity, coordinated channel messaging and a confident brand presentation.",
    meta: ["Web Design", "Frontend", "UI Refinement"],
  },
];

window.GEORGIAN_PROJECTS = [
  {
    id: "01",
    slug: "an-art-gallery",
    name: "Anart Gallery",
    tags: ["Gallery", "Web Design", "Responsive"],
    category: "Art / Gallery",
    country: "Georgia",
    url: "https://anartgallery.ge/",
    layout: "media-left",
    summary:
      "A refined digital presence for a Georgian art gallery — calm hierarchy, image-heavy layouts tuned for load speed, and a quiet luxury aesthetic.",
    meta: ["Frontend", "UI Refinement", "Performance"],
  },
  {
    id: "02",
    slug: "location-georgia",
    name: "Location Georgia",
    tags: ["Delivery", "Location Discovery", "Georgia"],
    category: "Delivery / Discovery",
    country: "Georgia",
    url: "https://location-georgia.netlify.app/",
    layout: "media-right",
    summary:
      "A full-stack Georgian delivery platform with dedicated User, Admin, and Courier sides — organized filtering, live information exchange, and a clear destination-first experience.",
    meta: ["Frontend", "Web Design", "Responsive UI"],
  },
];

/**
 * Interactive games - separate from agency / client work.
 * Shape: { title, category, description, technologies, previewImage, liveUrl, featured?, slug?, id? }
 */
window.GAME_PROJECTS = [
  {
    id: "01",
    slug: "cubeverse",
    title: "CubeVerse",
    category: "Interactive 3D Game",
    description:
      "An interactive 3D Rubik's Cube experience built for the web, featuring realistic cube mechanics, challenges, learning modes, customization, and responsive gameplay.",
    technologies: ["Angular", "TypeScript", "Three.js", "WebGL"],
    previewImage: "assets/games/cubeverse/preview.jpg",
    liveUrl: "https://ns-cube.netlify.app/",
    featured: true,
  },
  {
    id: "02",
    slug: "gartoba",
    title: "Gartoba",
    category: "Multiplayer Table Games",
    description:
      "A shared space where friends gather to play classic Georgian games together — private tables, invite-only rooms, and live multiplayer.",

    technologies: ["Angular", "TypeScript", "SignalR"],
    previewImage: "assets/games/gartoba/preview.jpg",
    liveUrl: "https://gartoba.netlify.app/",
    featured: true,
  },
];
