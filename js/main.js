/* *************** NAVBAR *************** */
// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
  var x = document.getElementById("mobileMenu");
  if (x && x.className.indexOf("w3-show") === -1) {
    x.className += " w3-show";
  } else if (x) {
    x.className = x.className.replace(" w3-show", "");
  }
}

/* *************** CONTACT SUBJECT "OTHER" CHECK *************** */
const subjectDropdown = document.getElementById("subjectSelect");
const messageInput = document.getElementById("messageTextarea");
const triggerValue = "Other";

function toggleMessageRequirement() {
  if (!subjectDropdown || !messageInput) return;

  if (subjectDropdown.value === triggerValue) {
    messageInput.setAttribute("required", "required");
    messageInput.placeholder = "This field is required";
  } else {
    messageInput.removeAttribute("required");
    messageInput.placeholder = "";
  }
}

if (subjectDropdown) {
  subjectDropdown.addEventListener("change", toggleMessageRequirement);
  toggleMessageRequirement();
}

/* *************** EMAIL VALIDATION *************** */
const emailInput = document.getElementById("emailInput");
const emailError = document.getElementById("emailError");
const form = document.querySelector("form");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (emailInput && emailError && form) {
  emailInput.addEventListener("blur", function () {
    if (emailInput.value.trim() !== "" && !emailRegex.test(emailInput.value)) {
      emailError.style.display = "inline";
      emailInput.classList.add("w3-border-red");
    } else {
      emailError.style.display = "none";
      emailInput.classList.remove("w3-border-red");
    }
  });

  form.addEventListener("submit", function (e) {
    if (!emailRegex.test(emailInput.value)) {
      e.preventDefault();
      emailError.style.display = "inline";
      emailInput.classList.add("w3-border-red");
    }
  });
}

/* *************** MINISTRY IMAGE HOVER SWAP (UPDATED) *************** */
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("#ministry img.image-swap");

  images.forEach(function (img) {
    const originalSrc = img.getAttribute("src");
    const hoverSrc = img.getAttribute("data-hover");
    if (!originalSrc || !hoverSrc) return;

    // Store original once so it always restores correctly
    if (!img.dataset.originalSrc) img.dataset.originalSrc = originalSrc;

    img.addEventListener("mouseenter", function () {
      img.setAttribute("src", hoverSrc);
    });

    img.addEventListener("mouseleave", function () {
      img.setAttribute("src", img.dataset.originalSrc);
    });
  });
});

/* *************** MINISTRY HORIZONTAL SCROLLER (UPDATED) *************** */
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("ministry");
  const leftBtn = document.querySelector("#ministry-wrapper .scroll-btn.left");
  const rightBtn = document.querySelector("#ministry-wrapper .scroll-btn.right");

  if (!container || !leftBtn || !rightBtn) {
    console.warn("Ministry scroller - elements not found");
    return;
  }

  // Scroll amount: stable and independent of item width quirks
  function getScrollAmount() {
    // 80% of visible width feels like "one page"
    const amount = Math.round(container.clientWidth * 0.8);
    return amount > 0 ? amount : 0;
  }

  function scrollMinistry(direction) {
    const amount = getScrollAmount();
    if (!amount) {
      console.warn("Ministry scroller - scroll amount is 0");
      return;
    }

    container.scrollBy({
      left: direction * amount,
      behavior: "smooth"
    });

    // Update arrows after scroll animation settles
    setTimeout(updateArrows, 350);
    setTimeout(updateArrows, 700);
  }

  function updateArrows() {
    const tolerance = 5;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;

    if (currentScroll <= tolerance) {
      leftBtn.classList.add("disabled");
    } else {
      leftBtn.classList.remove("disabled");
    }

    if (currentScroll >= maxScroll - tolerance) {
      rightBtn.classList.add("disabled");
    } else {
      rightBtn.classList.remove("disabled");
    }
  }

  // Arrow click handlers (stop propagation so drag logic never interferes)
  leftBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (leftBtn.classList.contains("disabled")) return;
    scrollMinistry(-1);
  });

  rightBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (rightBtn.classList.contains("disabled")) return;
    scrollMinistry(1);
  });

  // Drag-to-scroll without breaking normal link clicks
  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let activePointerId = null;
  let moved = false;
  const DRAG_THRESHOLD = 8;

  container.addEventListener("pointerdown", function (e) {
    // Ignore clicks on the arrow buttons area, just in case
    if (e.target && e.target.closest && e.target.closest(".scroll-btn")) return;

    isPointerDown = true;
    moved = false;
    activePointerId = e.pointerId;
    startX = e.clientX;
    startScrollLeft = container.scrollLeft;

    container.style.cursor = "grabbing";
  });

  container.addEventListener("pointermove", function (e) {
    if (!isPointerDown || e.pointerId !== activePointerId) return;

    const dx = e.clientX - startX;

    if (Math.abs(dx) > DRAG_THRESHOLD) {
      moved = true;

      // Capture only once we know it's a drag
      if (!container.hasPointerCapture(activePointerId)) {
        container.setPointerCapture(activePointerId);
      }

      container.scrollLeft = startScrollLeft - dx;
      e.preventDefault();
    }
  });

  function endDrag(e) {
    if (!isPointerDown || (e && e.pointerId !== activePointerId)) return;

    isPointerDown = false;

    if (activePointerId !== null && container.hasPointerCapture(activePointerId)) {
      try {
        container.releasePointerCapture(activePointerId);
      } catch (err) {
        // ignore
      }
    }

    activePointerId = null;
    container.style.cursor = "grab";
    updateArrows();
  }

  container.addEventListener("pointerup", endDrag);
  container.addEventListener("pointercancel", endDrag);
  container.addEventListener("pointerleave", endDrag);

  // If the user dragged, prevent click navigation (but keep normal clicks working)
  container.addEventListener("click", function (e) {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }
  }, true);

  // Update arrows on manual scroll (including drag or native touch scroll)
  container.addEventListener("scroll", updateArrows);

  // Initial checks
  window.addEventListener("load", function () {
    updateArrows();
    setTimeout(updateArrows, 200);
  });

  updateArrows();
});

/* ************ GO TO TOP BUTTON - DISPLAYS AFTER 300PX OF SCROLLING ************ */
document.addEventListener("DOMContentLoaded", function () {
  const topBtn = document.querySelector(".go-to-top-button");
  if (!topBtn) return;

  function toggleTopButton() {
    if (window.scrollY > 300) {
      topBtn.style.display = "block";
    } else {
      topBtn.style.display = "none";
    }
  }

  window.addEventListener("scroll", toggleTopButton);
  toggleTopButton();
});
