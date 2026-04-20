const kissLayer = document.getElementById("kissLayer");
const isShopPage = document.body.classList.contains("shop-page");

if (kissLayer) {
  const kissImage = "assets/imageassets/lips.png";
  const maxKisses = window.innerWidth <= 780 ? 15 : 28;

  function getExclusionZones() {
    const selectors = document.body.classList.contains("landing-page")
      ? [".container"]
      : [".storefront-logo-link"];

    return selectors
      .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .map((element) => {
        const rect = element.getBoundingClientRect();

        return {
          left: rect.left + window.scrollX - 28,
          right: rect.right + window.scrollX + 28,
          top: rect.top + window.scrollY - 28,
          bottom: rect.bottom + window.scrollY + 28,
        };
      });
  }

  function overlapsZone(x, y, size, zones) {
    return zones.some((zone) => {
      const right = x + size;
      const bottom = y + size;

      return !(
        right < zone.left ||
        x > zone.right ||
        bottom < zone.top ||
        y > zone.bottom
      );
    });
  }

  function createKiss() {
    const kiss = document.createElement("img");
    const rotation = Math.random() * 360;
    const scale = 1.4 + Math.random() * 1.4;
    const size = 60 * scale;
    const zones = getExclusionZones();
    const maxWidth = Math.max(window.innerWidth - size, 0);
    const maxHeight = Math.max(Math.max(document.body.scrollHeight, window.innerHeight) - size, 0);
    let x = 0;
    let y = 0;

    for (let attempt = 0; attempt < 30; attempt += 1) {
      x = Math.random() * maxWidth;
      y = Math.random() * maxHeight;

      if (!overlapsZone(x, y, size, zones)) {
        break;
      }
    }

    kiss.src = kissImage;
    kiss.alt = "";
    kiss.className = "kiss";
    kiss.style.left = `${x}px`;
    kiss.style.top = `${y}px`;
    kiss.style.transform = `rotate(${rotation}deg) scale(${scale})`;

    kissLayer.appendChild(kiss);
  }

  for (let count = 0; count < maxKisses; count += 1) {
    window.setTimeout(createKiss, count * 140);
  }
}

if (isShopPage) {
  let lastTrailTime = 0;
  let skullIndex = 0;
  const skulls = ["☠︎︎", "⋆₊", "♱"];

  function createSkullTrail(event) {
    const now = Date.now();

    if (now - lastTrailTime < 45) {
      return;
    }

    lastTrailTime = now;

    const trail = document.createElement("span");
    const driftX = `${(Math.random() - 0.5) * 18}px`;
    const driftY = `${Math.random() * 10 + 12}px`;

    trail.className = "skull-trail";
    trail.textContent = skulls[skullIndex];
    trail.style.left = `${event.clientX}px`;
    trail.style.top = `${event.clientY}px`;
    trail.style.setProperty("--drift-x", driftX);
    trail.style.setProperty("--drift-y", driftY);

    document.body.appendChild(trail);

    skullIndex = (skullIndex + 1) % skulls.length;

    window.setTimeout(() => {
      trail.remove();
    }, 950);
  }

  window.addEventListener("pointermove", createSkullTrail, { passive: true });
}

document.querySelectorAll("[data-rotating-image]").forEach((rotatingImage) => {
  const imageList = (rotatingImage.dataset.images || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (imageList.length > 1) {
    let imageIndex = 0;
    const preloadedImages = [];

    imageList.forEach((src) => {
      const image = new Image();
      image.src = src;
      preloadedImages.push(image);
    });

    window.setInterval(() => {
      imageIndex = (imageIndex + 1) % imageList.length;
      rotatingImage.src = imageList[imageIndex];
    }, 3200);
  }
});
