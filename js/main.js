/* *************** NAVBAR *************** */
// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
  var x = document.getElementById("mobileMenu");
  if (x.className.indexOf("w3-show") == -1) {
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
document.addEventListener("DOMContentLoaded", () => {
  const anchors = document.querySelectorAll(".scroll-item a");

  anchors.forEach((anchor) => {
    const img = anchor.querySelector(".image-swap");
    if (!img) return;

    const originalSrc = img.src;
    const hoverSrc = img.getAttribute("data-hover");

    anchor.addEventListener("mouseenter", () => {
      if (hoverSrc) {
        img.src = hoverSrc;
      }
    });

    anchor.addEventListener("mouseleave", () => {
      img.src = originalSrc;
    });
  });
});

/* *************** MINISTRY HORIZONTAL SCROLLER *************** */
document.addEventListener("DOMContentLoaded", () => {
  // Scrollable container and arrow buttons
  const container = document.getElementById("ministry");
  const leftBtn = document.querySelector("#ministry-wrapper .scroll-btn.left");
  const rightBtn = document.querySelector("#ministry-wrapper .scroll-btn.right");

  if (!container || !leftBtn || !rightBtn) return;

  // Returns the current scroll distance for one "card"
  function getScrollAmount() {
    const card = container.querySelector(".scroll-item");
    if (!card) return 0;

    const rect = card.getBoundingClientRect();
    const style = window.getComputedStyle(card);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;

    // Width plus horizontal margins
    return rect.width + marginLeft + marginRight;
  }

  function scrollMinistry(direction) {
    const amount = getScrollAmount();
    if (!amount) return;

    container.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });

    // Update arrow state after scroll animation begins
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

  // Initial state when everything is loaded
  window.addEventListener("load", () => {
    updateArrows();
    setTimeout(updateArrows, 200);
  });

  // Arrow click handlers
  leftBtn.addEventListener("click", () => {
    scrollMinistry(-1);
  });

  rightBtn.addEventListener("click", () => {
    scrollMinistry(1);
  });

  // Live update while user scrolls manually
  container.addEventListener("scroll", updateArrows);

  // Initial call
  updateArrows();
});
/* *************** NAVBAR *************** */
// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
  var x = document.getElementById("mobileMenu");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else { 
    x.className = x.className.replace(" w3-show", "");
  }
}

// *************** Checks when user selects "Other" in contact us section
const subjectDropdown = document.getElementById('subjectSelect');
const messageInput = document.getElementById('messageTextarea'); // Renamed variable for clarity
const triggerValue = "Other"; // *** THIS MUST MATCH THE OPTION'S VALUE EXACTLY ***

// Define a function to run on change
function toggleMessageRequirement() {
  // Check if the currently selected value is the trigger value
  if (subjectDropdown.value === triggerValue) {
    // If it is, make the message mandatory
    messageInput.setAttribute('required', 'required');
    messageInput.placeholder = "This field is required";
  } else {
    // Otherwise, remove the mandatory requirement
    messageInput.removeAttribute('required');
    messageInput.placeholder = ""; // Clear placeholder if needed
  }
}

// Detect when the dropdown selection changes
subjectDropdown.addEventListener('change', toggleMessageRequirement);

// Checks on page load in case the form is pre-filled or cached
toggleMessageRequirement();


// *************** Checks email field for validity        
const emailInput = document.getElementById('emailInput');
const emailError = document.getElementById('emailError');
const form = document.querySelector('form');
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

emailInput.addEventListener('blur', function() {
if (emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value)) {
emailError.style.display = 'inline';
emailInput.classList.add('w3-border-red');
} else {
emailError.style.display = 'none';
emailInput.classList.remove('w3-border-red');
}
});

form.addEventListener('submit', function(e) {
if (!emailRegex.test(emailInput.value)) {
e.preventDefault(); // stop form submission
emailError.style.display = 'inline';
emailInput.classList.add('w3-border-red');
}
});       

// ********** Swaps photos on mouseenter event
document.addEventListener('DOMContentLoaded', () => {
  // 1. Select all ANCHOR tags that contain the image.
  // We'll use the 'a' tag selector and assume your .image-swap is inside it.
  const anchors = document.querySelectorAll('.scroll-item a');

  anchors.forEach(anchor => {
      // 2. Find the image *inside* the current anchor tag
      const img = anchor.querySelector('.image-swap');
      
      // Safety check: if no image found, skip this anchor
      if (!img) return;

      // Store the original source and hover source for THIS image
      const originalSrc = img.src;
      const hoverSrc = img.getAttribute('data-hover');

      // --- Event Listener for MOUSE OVER (Hover ON) ---
      // Listener is now on the ANCHOR (which includes the text)
      anchor.addEventListener('mouseenter', () => {
          if (hoverSrc) {
              img.src = hoverSrc; // Change the image source
          }
      });

      // --- Event Listener for MOUSE OUT (Hover OFF) ---
      // Listener is now on the ANCHOR
      anchor.addEventListener('mouseleave', () => {
          img.src = originalSrc; // Swap back
      });
  });
});
// For scrolling left/rigfht in the mministry section
document.addEventListener("DOMContentLoaded", () => {
// Select the actual scrollable element (now the inner div)
const container = document.getElementById("ministry");
const leftBtn = document.querySelector("#ministry-wrapper .scroll-btn.left"); // Use the wrapper to target the buttons
const rightBtn = document.querySelector("#ministry-wrapper .scroll-btn.right");
const scrollAmount = 300;

// Check if elements exist before proceeding
if (!container || !leftBtn || !rightBtn) return;

// This function scrolls the container and is only called by the listeners
function scrollMinistry(direction) {
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth"
  });
  // Immediately call updateArrows after the scroll is initiated (smooth scroll takes time)
  setTimeout(updateArrows, 500); 
}

function updateArrows() {
  // Use a small tolerance for floating point errors
  const tolerance = 5; 
  const maxScroll = container.scrollWidth - container.clientWidth;
  const currentScroll = container.scrollLeft;
  
  // Disable left if fully at start
  if (currentScroll <= tolerance) {
    leftBtn.classList.add("disabled");
  } else {
    leftBtn.classList.remove("disabled");
  }
  
  // Disable right if fully at end (add tolerance to maxScroll check)
  if (currentScroll >= maxScroll - tolerance) {
    rightBtn.classList.add("disabled");
  } else {
    rightBtn.classList.remove("disabled");
  }
}

// --- Event Listeners ---

// 1. Initial check (Right button should be active, Left disabled)
// Run after the DOM is ready and window content (like images) has loaded
window.addEventListener("load", () => {
  updateArrows();
  // A small delay helps if elements are lazy-loaded or calculated late
  setTimeout(updateArrows, 200);
});

// 2. Scroll button clicks
leftBtn.addEventListener("click", () => {
  scrollMinistry(-1);
});

rightBtn.addEventListener("click", () => {
  scrollMinistry(1);
});

// 3. Monitor real-time scroll (user scrolling with mouse/trackpad)
container.addEventListener("scroll", updateArrows);

// Initial call in case no images are used or to disable the left button right away
updateArrows(); 
});
