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

/* *************** MINISTRY IMAGE HOVER SWAP (FIXED) *************** */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("#ministry img.image-swap").forEach(function (img) {
    const originalSrc = img.getAttribute("src");
    const hoverSrc = img.getAttribute("data-hover");
    if (!hoverSrc) return;

    img.dataset.originalSrc = originalSrc;

    img.addEventListener("mouseenter", function () {
      img.setAttribute("src", hoverSrc);
    });

    img.addEventListener("mouseleave", function () {
      img.setAttribute("src", img.dataset.originalSrc);
    });
  });
});

/* *************** MINISTRY HORIZONTAL SCROLLER (FIXED) *************** */
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("ministry");
  const leftBtn = document.querySelector("#ministry-wrapper .scroll-btn.left");
  const rightBtn = document.querySelector("#ministry-wrapper .scroll-btn.right");

  if (!container || !leftBtn || !rightBtn) return;

  function getScrollAmount() {
    return Math.round(container.clientWidth * 0.8);
  }

  function updateArrows() {
    const tolerance = 5;
    const maxScroll = container.scrollWidth - container.clientWidth;

    leftBtn.classList.toggle("disabled", container.scrollLeft <= tolerance);
    rightBtn.classList.toggle("disabled", container.scrollLeft >= maxScroll - tolerance);
  }

  leftBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (leftBtn.classList.contains("disabled")) return;
    container.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  rightBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (rightBtn.classList.contains("disabled")) return;
    container.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let dragged = false;
  const DRAG_THRESHOLD = 8;

  container.addEventListener("pointerdown", function (e) {
    isDown = true;
    dragged = false;
    startX = e.clientX;
    startScrollLeft = container.scrollLeft;
  });

  container.addEventListener("pointermove", function (e) {
    if (!isDown) return;

    const dx = e.clientX - startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) dragged = true;

    if (dragged) {
      container.scrollLeft = startScrollLeft - dx;
      e.preventDefault();
    }
  });

  container.addEventListener("pointerup", function () {
    isDown = false;
    updateArrows();
  });

  container.addEventListener("click", function (e) {
    if (dragged) {
      e.preventDefault();
      e.stopPropagation();
      dragged = false;
    }
  }, true);

  container.addEventListener("scroll", updateArrows);
  window.addEventListener("load", updateArrows);
});

/* ************ GO TO TOP BUTTON ************ */
document.addEventListener("DOMContentLoaded", function () {
  const topBtn = document.querySelector(".go-to-top-button");
  if (!topBtn) return;

  function toggleTopButton() {
    topBtn.style.display = window.scrollY > 300 ? "block" : "none";
  }

  window.addEventListener("scroll", toggleTopButton);
  toggleTopButton();
});
