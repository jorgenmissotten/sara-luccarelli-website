document.addEventListener("DOMContentLoaded", () => {
  const workGrid = document.getElementById("work-grid");
  const lightboxes = document.getElementById("lightboxes");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[ch]));
  }

  // Build the portfolio cards.
  portfolio.forEach((series, seriesIndex) => {
    const card = document.createElement("article");
    card.className = "work-card";
    card.innerHTML = `
      <button class="card-image" type="button" data-series-index="${seriesIndex}" aria-label="Open ${escapeHtml(series.title)}">
        <img src="${series.cover}" alt="${escapeHtml(series.title)}" loading="lazy">
      </button>
      <h2>${escapeHtml(series.title)}</h2>
    `;
    workGrid.appendChild(card);
  });

  // One real JavaScript lightbox for every series/photo. This avoids the
  // old CSS :target navigation and makes swiping reliable on iPhone Safari.
  lightboxes.innerHTML = `
    <div class="lightbox" id="portfolio-lightbox" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Photo viewer">
      <button class="lightbox-close" type="button" aria-label="Close">×</button>
      <button class="lightbox-arrow prev" type="button" aria-label="Previous photo">←</button>
      <figure class="lightbox-stage">
        <img class="lightbox-image" src="" alt="" draggable="false">
        <figcaption>
          <span class="lightbox-title"></span>
          <span class="lightbox-count"></span>
        </figcaption>
      </figure>
      <button class="lightbox-arrow next" type="button" aria-label="Next photo">→</button>
    </div>
  `;

  const lightbox = document.getElementById("portfolio-lightbox");
  const stage = lightbox.querySelector(".lightbox-stage");
  const image = lightbox.querySelector(".lightbox-image");
  const title = lightbox.querySelector(".lightbox-title");
  const count = lightbox.querySelector(".lightbox-count");
  const prevButton = lightbox.querySelector(".lightbox-arrow.prev");
  const nextButton = lightbox.querySelector(".lightbox-arrow.next");
  const closeButton = lightbox.querySelector(".lightbox-close");

  let currentSeries = 0;
  let currentImage = 0;

  function renderPhoto() {
    const series = portfolio[currentSeries];
    const src = series.images[currentImage];
    image.src = src;
    image.alt = `${series.title} — ${currentImage + 1}`;
    title.textContent = series.title;
    count.textContent = `${currentImage + 1} / ${series.images.length}`;

    prevButton.disabled = currentImage === 0;
    nextButton.disabled = currentImage === series.images.length - 1;
    prevButton.classList.toggle("disabled", prevButton.disabled);
    nextButton.classList.toggle("disabled", nextButton.disabled);
  }

  function openLightbox(seriesIndex, imageIndex = 0) {
    currentSeries = seriesIndex;
    currentImage = imageIndex;
    renderPhoto();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    closeButton.focus({ preventScroll: true });
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  }

  function previousPhoto() {
    if (currentImage > 0) {
      currentImage -= 1;
      renderPhoto();
    }
  }

  function nextPhoto() {
    if (currentImage < portfolio[currentSeries].images.length - 1) {
      currentImage += 1;
      renderPhoto();
    }
  }

  workGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".card-image[data-series-index]");
    if (!button) return;
    openLightbox(Number(button.dataset.seriesIndex), 0);
  });

  prevButton.addEventListener("click", previousPhoto);
  nextButton.addEventListener("click", nextPhoto);
  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") previousPhoto();
    if (event.key === "ArrowRight") nextPhoto();
  });

  // iPhone/iPad swipe support. The movement is tracked on the entire stage,
  // so the gesture still works when the finger starts directly on the image.
  let touchStartX = 0;
  let touchStartY = 0;
  let touchLastX = 0;
  let touchLastY = 0;
  let horizontalGesture = false;

  stage.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchLastX = touch.clientX;
    touchLastY = touch.clientY;
    horizontalGesture = false;
  }, { passive: true });

  stage.addEventListener("touchmove", (event) => {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    touchLastX = touch.clientX;
    touchLastY = touch.clientY;

    const dx = touchLastX - touchStartX;
    const dy = touchLastY - touchStartY;

    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.15) {
      horizontalGesture = true;
      // Prevent Safari from treating a horizontal gallery swipe as page movement.
      event.preventDefault();
    }
  }, { passive: false });

  stage.addEventListener("touchend", () => {
    const dx = touchLastX - touchStartX;
    const dy = touchLastY - touchStartY;
    const minSwipe = Math.min(55, window.innerWidth * 0.12);

    if (horizontalGesture && Math.abs(dx) >= minSwipe && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) nextPhoto();
      else previousPhoto();
    }

    horizontalGesture = false;
  }, { passive: true });



  // Laptop/desktop navigation: horizontal two-finger trackpad swipe
  // and click-drag with a mouse. Arrow keys and on-screen arrows keep working.
  let wheelAccum = 0;
  let wheelTimer = null;
  let wheelLocked = false;

  stage.addEventListener("wheel", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

    event.preventDefault();
    if (wheelLocked) return;

    wheelAccum += event.deltaX;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelAccum = 0; }, 180);

    if (Math.abs(wheelAccum) >= 55) {
      if (wheelAccum > 0) nextPhoto();
      else previousPhoto();
      wheelAccum = 0;
      wheelLocked = true;
      setTimeout(() => { wheelLocked = false; }, 420);
    }
  }, { passive: false });

  let mouseDragging = false;
  let mouseStartX = 0;
  let mouseLastX = 0;

  stage.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    mouseDragging = true;
    mouseStartX = event.clientX;
    mouseLastX = event.clientX;
    stage.classList.add("dragging");
    event.preventDefault();
  });

  stage.addEventListener("mousemove", (event) => {
    if (!mouseDragging) return;
    mouseLastX = event.clientX;
  });

  function finishMouseDrag() {
    if (!mouseDragging) return;
    const dx = mouseLastX - mouseStartX;
    mouseDragging = false;
    stage.classList.remove("dragging");

    if (Math.abs(dx) >= 60) {
      if (dx < 0) nextPhoto();
      else previousPhoto();
    }
  }

  stage.addEventListener("mouseup", finishMouseDrag);
  stage.addEventListener("mouseleave", finishMouseDrag);


  // Close the mobile menu after choosing a destination.
  document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
      const check = document.getElementById("menu-check");
      if (check) check.checked = false;
    });
  });
});
