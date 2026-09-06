const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const outRoot = path.resolve(__dirname, "../assets/projects");

const projects = [
  { slug: "smartads", url: "https://smartdigiads.com/", local: "C:/Users/User/Desktop/smartdigiads/index.html" },
  { slug: "adsystemhaus", url: "https://werbesystemhaus.com/", local: "C:/Users/User/Desktop/werbesystemhaus/index.html" },
  { slug: "advisor-ad-service", url: "https://adserviceadvisor.com/", local: "C:/Users/User/Desktop/adserviceadvisor/index.html" },
  { slug: "bbs", url: "https://bbswerbeexperten.com/", local: "C:/Users/User/Desktop/bbswerbeexperten/index.html" },
  { slug: "acm", url: "https://acmonlinewerbung.com/", local: "C:/Users/User/Desktop/acmonlinewerbung/index.html" },
  { slug: "ads-marketing-group", url: "https://adsdigitalmarketing.com/", local: "C:/Users/User/Desktop/agency tct/AdsDigitalMarketing/index.html" },
  { slug: "ads-everywhere", url: "https://adseverywhereinc.com/", local: "C:/Users/User/Desktop/agency tct/adseverywhereinc/index.html" },
  { slug: "ad-works", url: "https://adworksadvertising.com/", local: "C:/Users/User/Desktop/agency tct/ssss/index.html" },
  { slug: "ad-growth", url: "https://thegrowthplusads.com/", local: "C:/Users/User/Desktop/thegrowthplusads/index.html" },
  { slug: "acc-advertising", url: "https://accadvertisinginc.com/", local: "C:/Users/User/Desktop/accadvertisinginc/index.html" },
];

async function settle(page) {
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  }).catch(() => {});
}

async function gotoBest(page, project) {
  const targets = [];
  if (project.url) targets.push(project.url);
  if (project.local && fs.existsSync(project.local)) {
    targets.push(pathToFileURL(project.local).href);
  }
  let lastErr;
  for (const target of targets) {
    try {
      console.log(`  navigating ${target}`);
      await page.goto(target, { waitUntil: "load", timeout: 30000 });
      await settle(page);
      return target;
    } catch (e) {
      lastErr = e;
      console.log(`  fail: ${e.message}`);
    }
  }
  throw lastErr || new Error("no target");
}

(async () => {
  console.log("launching...");
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-web-security"],
  });
  console.log("launched");

  for (const project of projects) {
    const dir = path.join(outRoot, project.slug);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`\n=== ${project.slug} ===`);

    try {
      const page = await browser.newPage({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
      });
      await gotoBest(page, project);

      await page.screenshot({ path: path.join(dir, "hero.png") });
      console.log("  hero ok");

      const height = await page.evaluate(() => Math.min(document.documentElement.scrollHeight, 4200));
      await page.setViewportSize({ width: 1440, height: Math.max(900, Math.min(height, 2400)) });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(dir, "full.png"), fullPage: true });
      console.log("  full ok");

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.evaluate(() => window.scrollTo(0, 1100));
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(dir, "detail.png") });
      console.log("  detail ok");
      await page.close();

      const mobile = await browser.newPage({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      });
      await gotoBest(mobile, project);
      await mobile.screenshot({ path: path.join(dir, "mobile.png") });
      console.log("  mobile ok");
      await mobile.close();
    } catch (e) {
      console.error(`ERROR ${project.slug}:`, e.message);
    }
  }

  await browser.close();
  console.log("\nALL DONE");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
