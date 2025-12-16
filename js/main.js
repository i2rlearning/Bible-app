/* *************** NAVBAR *************** */
// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
  var x = document.getElementById("mobileMenu");
  if (x.className.indexOf("w3-show") === -1) {
    x.className += " w3-show";
  } else {
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

/* *************** MINISTRY IMAGE HOVER SWAP *************** */
document.addEventListener("DOMContentLoaded", function () {
  const anchors = document.querySelectorAll(".scroll-item a");

  anchors.forEach(function (anchor) {
    const img = anchor.querySelector(".image-swap");
    if (!img) return;

    const originalSrc = img.src;
    const hoverSrc = img.getAttribute("data-hover");

    anchor.addEventListener("mouseenter", function () {
      if (hoverSrc) {
        img.src = hoverSrc;
      }
    });

    anchor.addEventListener("mouseleave", function () {
      img.src = originalSrc;
    });
  });
});

/* *************** MINISTRY HORIZONTAL SCROLLER *************** */
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("ministry");
  const leftBtn = document.querySelector("#ministry-wrapper .scroll-btn.left");
  const rightBtn = document.querySelector("#ministry-wrapper .scroll-btn.right");

  if (!container || !leftBtn || !rightBtn) {
    console.warn("Ministry scroller - elements not found");
    return;
  }

  // Scroll by one card width (with margins) if possible
  function getScrollAmount() {
    const card = container.querySelector(".scroll-item");
    if (card) {
      const rect = card.getBoundingClientRect();
      const style = window.getComputedStyle(card);
      const marginLeft = parseFloat(style.marginLeft) || 0;
      const marginRight = parseFloat(style.marginRight) || 0;
      const cardWidth = rect.width + marginLeft + marginRight;

      if (cardWidth > 0) {
        return cardWidth;
      }
    }

    // Fallback: visible width of container
    return container.clientWidth || 0;
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

    setTimeout(updateArrows, 500);
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

  // Arrow click handlers
  leftBtn.addEventListener("click", function () {
    scrollMinistry(-1);
  });

  rightBtn.addEventListener("click", function () {
    scrollMinistry(1);
  });

  // Touchscreen / mouse drag to scroll
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let activePointerId = null;

  container.addEventListener("pointerdown", function (e) {
    isDragging = true;
    activePointerId = e.pointerId;
    container.setPointerCapture(activePointerId);
    startX = e.clientX;
    startScrollLeft = container.scrollLeft;
  });

  container.addEventListener("pointermove", function (e) {
    if (!isDragging || e.pointerId !== activePointerId) return;
    const dx = e.clientX - startX;
    container.scrollLeft = startScrollLeft - dx;
  });

  function endDrag(e) {
    if (!isDragging || (e && e.pointerId !== activePointerId)) return;
    isDragging = false;
    if (activePointerId !== null) {
      try {
        container.releasePointerCapture(activePointerId);
      } catch (err) {
        // ignore if capture was not set
      }
    }
    activePointerId = null;
    updateArrows();
  }

  container.addEventListener("pointerup", endDrag);
  container.addEventListener("pointercancel", endDrag);
  container.addEventListener("pointerleave", endDrag);

  // Update arrows on manual scroll (including drag or native touch scroll)
  container.addEventListener("scroll", updateArrows);

  // Initial checks
  window.addEventListener("load", function () {
    updateArrows();
    setTimeout(updateArrows, 200);
  });

  updateArrows();
});

// ************ GO TO TOP BUTTON - DISPLAYS AFTER 300PX OF SCROLLING *****************
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

  // Handle scroll
  window.addEventListener("scroll", toggleTopButton);
  // Initial state
  toggleTopButton();
});
