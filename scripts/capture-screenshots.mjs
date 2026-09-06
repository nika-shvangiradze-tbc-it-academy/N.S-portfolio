import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outRoot = path.resolve(__dirname, "../assets/projects");

const projects = [
  {
    slug: "smartads",
    url: "https://smartdigiads.com/",
    local: "C:/Users/User/Desktop/smartdigiads/index.html",
  },
  {
    slug: "adsystemhaus",
    url: "https://werbesystemhaus.com/",
    local: "C:/Users/User/Desktop/werbesystemhaus/index.html",
  },
  {
    slug: "advisor-ad-service",
    url: "https://adserviceadvisor.com/",
    local: "C:/Users/User/Desktop/adserviceadvisor/index.html",
  },
  {
    slug: "bbs",
    url: "https://bbswerbeexperten.com/",
    local: "C:/Users/User/Desktop/bbswerbeexperten/index.html",
  },
  {
    slug: "acm",
    url: "https://acmonlinewerbung.com/",
    local: "C:/Users/User/Desktop/acmonlinewerbung/index.html",
  },
  {
    slug: "ads-marketing-group",
    url: "https://adsdigitalmarketing.com/",
    local: "C:/Users/User/Desktop/agency tct/AdsDigitalMarketing/index.html",
  },
  {
    slug: "ads-everywhere",
    url: "https://adseverywhereinc.com/",
    local: "C:/Users/User/Desktop/agency tct/adseverywhereinc/index.html",
  },
  {
    slug: "ad-works",
    url: "https://adworksadvertising.com/",
    local: "C:/Users/User/Desktop/agency tct/ssss/index.html",
  },
  {
    slug: "ad-growth",
    url: "https://thegrowthplusads.com/",
    local: "C:/Users/User/Desktop/thegrowthplusads/index.html",
  },
  {
    slug: "acc-advertising",
    url: "https://accadvertisinginc.com/",
    local: "C:/Users/User/Desktop/accadvertisinginc/index.html",
  },
];

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  try {
    await page.waitForLoadState("networkidle", { timeout: 12000 });
  } catch {
    /* continue */
  }
  await page.waitForTimeout(1200);
  await page.evaluate(async () => {
    const imgs = [...document.images];
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            })
      )
    );
  });
}

async function openProject(page, project) {
  const candidates = [];
  if (project.url) candidates.push(project.url);
  if (project.local && fs.existsSync(project.local)) {
    candidates.push(pathToFileURL(project.local).href);
  }

  let lastError;
  for (const target of candidates) {
    try {
      await page.goto(target, { waitUntil: "domcontentloaded", timeout: 45000 });
      await settle(page);
      return target;
    } catch (err) {
      lastError = err;
      console.warn(`Failed ${project.slug} via ${target}: ${err.message}`);
    }
  }
  throw lastError || new Error(`No source for ${project.slug}`);
}

async function captureProject(browser, project) {
  const dir = path.join(outRoot, project.slug);
  fs.mkdirSync(dir, { recursive: true });

  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const source = await openProject(desktop, project);
  console.log(`Capturing ${project.slug} from ${source}`);

  await desktop.screenshot({
    path: path.join(dir, "hero.png"),
    type: "png",
  });

  await desktop.screenshot({
    path: path.join(dir, "full.png"),
    type: "png",
    fullPage: true,
  });

  // Mid-page crop for detail
  await desktop.evaluate(() => window.scrollTo(0, Math.min(900, document.body.scrollHeight * 0.35)));
  await desktop.waitForTimeout(400);
  await desktop.screenshot({
    path: path.join(dir, "detail.png"),
    type: "png",
  });

  await desktop.close();

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  await openProject(mobile, project);
  await mobile.screenshot({
    path: path.join(dir, "mobile.png"),
    type: "png",
  });
  await mobile.close();

  console.log(`Done ${project.slug}`);
}

const browser = await chromium.launch({ headless: true });
try {
  for (const project of projects) {
    try {
      await captureProject(browser, project);
    } catch (err) {
      console.error(`ERROR ${project.slug}:`, err.message);
    }
  }
} finally {
  await browser.close();
}
