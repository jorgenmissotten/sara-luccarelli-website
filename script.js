
document.addEventListener("DOMContentLoaded", () => {
  const workGrid = document.getElementById("work-grid");
  const lightboxes = document.getElementById("lightboxes");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[ch]));
  }

  portfolio.forEach(series => {
    const card = document.createElement("article");
    card.className = "work-card";
    card.innerHTML = `
      <a class="card-image" href="#lb-${series.slug}-0" aria-label="Open ${escapeHtml(series.title)}">
        <img src="${series.cover}" alt="${escapeHtml(series.title)}" loading="lazy">
      </a>
      <h2>${escapeHtml(series.title)}</h2>
    `;
    workGrid.appendChild(card);

    series.images.forEach((src, index) => {
      const prev = index === 0 ? "#work" : `#lb-${series.slug}-${index - 1}`;
      const next = index === series.images.length - 1 ? "#work" : `#lb-${series.slug}-${index + 1}`;

      const box = document.createElement("div");
      box.className = "css-lightbox";
      box.id = `lb-${series.slug}-${index}`;
      box.setAttribute("aria-hidden", "true");
      box.innerHTML = `
        <figure>
          <img src="${src}" alt="${escapeHtml(series.title)} — ${index + 1}">
          <figcaption>
            <span>${escapeHtml(series.title)}</span>
            <span>${index + 1} / ${series.images.length}</span>
          </figcaption>
        </figure>
        <a class="lb-close" href="#work" aria-label="Close">×</a>
        <a class="lb-prev" href="${prev}" aria-label="Previous photo">←</a>
        <a class="lb-next" href="${next}" aria-label="Next photo">→</a>
      `;
      lightboxes.appendChild(box);
    });
  });

  document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
      const check = document.getElementById("menu-check");
      if (check) check.checked = false;
    });
  });
});
