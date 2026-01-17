/* *************** NAVBAR *************** */
function openNav() {
  var x = document.getElementById("mobileMenu");
  if (x && x.className.indexOf("w3-show") === -1) {
    x.className += " w3-show";
  } else if (x) {
    x.className = x.className.replace(" w3-show", "");
  }
}

/* *************** CONTACT SUBJECT "OTHER" CHECK *************** */
// Wrapped in DOMContentLoaded to ensure elements exist before listeners attach
document.addEventListener("DOMContentLoaded", function () {
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
});

/* *************** EMAIL VALIDATION *************** */
document.addEventListener("DOMContentLoaded", function () {
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
});

/* *************** MINISTRY IMAGE HOVER SWAP *************** */
document.addEventListener("DOMContentLoaded", function () {
  const anchors = document.querySelectorAll(".scroll-item a");
  anchors.forEach(function (anchor) {
    const img = anchor.querySelector(".image-swap");
    if (!img) return;
    const originalSrc = img.src;
    const hoverSrc = img.getAttribute("data-hover");
    anchor.addEventListener("mouseenter", function () {
      if (hoverSrc) img.src = hoverSrc;
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

  // SAFETY CHECK: If we aren't on a page with the 'ministry' ID, skip everything below.
  if (!container || !leftBtn || !rightBtn) {
    return;
  }

  function getScrollAmount() {
    const card = container.querySelector(".scroll-item");
    if (card) {
      const rect = card.getBoundingClientRect();
      const style = window.getComputedStyle(card);
      const marginLeft = parseFloat(style.marginLeft) || 0;
      const marginRight = parseFloat(style.marginRight) || 0;
      return rect.width + marginLeft + marginRight;
    }
    return container.clientWidth || 0;
  }

  function scrollMinistry(direction) {
    const amount = getScrollAmount();
    if (!amount) return;
    container.scrollBy({ left: direction * amount, behavior: "smooth" });
    setTimeout(updateArrows, 500);
  }

  function updateArrows() {
    const tolerance = 5;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;
    leftBtn.classList.toggle("disabled", currentScroll <= tolerance);
    rightBtn.classList.toggle("disabled", currentScroll >= maxScroll - tolerance);
  }

  leftBtn.addEventListener("click", (e) => { e.preventDefault(); scrollMinistry(-1); });
  rightBtn.addEventListener("click", (e) => { e.preventDefault(); scrollMinistry(1); });

  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let activePointerId = null;
  const DRAG_THRESHOLD = 8;

  container.addEventListener("pointerdown", function (e) {
    isPointerDown = true;
    activePointerId = e.pointerId;
    startX = e.clientX;
    startScrollLeft = container.scrollLeft;
  });

  container.addEventListener("pointermove", function (e) {
    if (!isPointerDown || e.pointerId !== activePointerId) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      if (!container.hasPointerCapture(activePointerId)) {
        container.setPointerCapture(activePointerId);
      }
      container.scrollLeft = startScrollLeft - dx;
    }
  });

  function endDrag(e) {
    if (!isPointerDown || (e && e.pointerId !== activePointerId)) return;
    isPointerDown = false;
    if (activePointerId !== null && container.hasPointerCapture(activePointerId)) {
      try { container.releasePointerCapture(activePointerId); } catch (err) {}
    }
    activePointerId = null;
    updateArrows();
  }

  container.addEventListener("pointerup", endDrag);
  container.addEventListener("pointercancel", endDrag);
  container.addEventListener("pointerleave", endDrag);
  container.addEventListener("scroll", updateArrows);

  window.addEventListener("load", () => {
    updateArrows();
    setTimeout(updateArrows, 200);
  });
});

/* ************ GO TO TOP BUTTON ************ */
document.addEventListener("DOMContentLoaded", function () {
  const topBtn = document.querySelector(".go-to-top-button");
  if (!topBtn) return;

  function toggleTopButton() {
    topBtn.style.display = (window.scrollY > 300) ? "block" : "none";
  }

  window.addEventListener("scroll", toggleTopButton);
  toggleTopButton();
});
