document.addEventListener("DOMContentLoaded", () => {
  const marqueeTrack = document.querySelector(".marquee-track");
  if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }

  // Hide the header when scrolling down past a threshold, show when scrolling up.
  const headerWrapper = document.querySelector(".header-wrapper");
  let lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;

      if (headerWrapper) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          headerWrapper.classList.add("hide");
        } else {
          headerWrapper.classList.remove("hide");
        }
      }

      lastScrollY = currentScrollY;
    },
    { passive: true },
  );

  // Elements for opening/closing the datasheet download modal.
  const downloadBtn = document.getElementById("downloadDatasheetBtn");
  const modalOverlay = document.getElementById("datasheetModal");
  const modalClose = modalOverlay && modalOverlay.querySelector(".modal-close");
  const modalForm = modalOverlay && modalOverlay.querySelector(".modal-form");
  const modalDialog = modalOverlay && modalOverlay.querySelector(".modal");

  let lastFocusedElement = null;

  const getModalFocusableElements = () => {
    if (!modalDialog) return [];
    return Array.from(
      modalDialog.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled"));
  };

  const openModal = () => {
    if (!modalOverlay) return;
    lastFocusedElement = document.activeElement;
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");

    const focusable = getModalFocusableElements();
    if (focusable.length) {
      focusable[0].focus();
    }
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const trapModalFocus = (event) => {
    if (!modalOverlay || !modalOverlay.classList.contains("open")) return;
    if (event.key !== "Tab") return;

    const focusable = getModalFocusableElements();
    if (!focusable.length) return;

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];
    const isShift = event.shiftKey;

    if (isShift && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!isShift && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  };

  const onDocumentKeyDown = (event) => {
    if (!modalOverlay || !modalOverlay.classList.contains("open")) return;

    if (event.key === "Escape" || event.key === "Esc") {
      closeModal();
      return;
    }

    trapModalFocus(event);
  };

  if (downloadBtn) downloadBtn.addEventListener("click", openModal);
  if (modalClose) modalClose.addEventListener("click", closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", onDocumentKeyDown);

  // form validation for download button

  if (modalForm) {
    const emailInput = modalForm.querySelector('input[name="email"]');
    const phoneInput = modalForm.querySelector('input[name="phone"]');
    const submitBtn = modalForm.querySelector('button[type="submit"]');

    const validateForm = () => {
      if (!emailInput || !phoneInput || !submitBtn) return;

      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();

      const isEmailValid = emailInput.checkValidity() && email.length > 0;
      const isPhoneValid = phone.length > 0;

      if (isEmailValid && isPhoneValid) {
        submitBtn.disabled = false;

        submitBtn.style.opacity = "1";
        submitBtn.style.cursor = "pointer";
      } else {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        submitBtn.style.cursor = "not-allowed";
      }
    };

    emailInput && emailInput.addEventListener("input", validateForm);
    phoneInput && phoneInput.addEventListener("input", validateForm);
    emailInput && emailInput.addEventListener("blur", validateForm);
    phoneInput && phoneInput.addEventListener("blur", validateForm);

    validateForm();

    modalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      closeModal();
    });
  }

  // product image magnifier
  const imageWrapper = document.querySelector(".main-image-wrapper");
  const image = document.getElementById("productImage");
  const lens = document.querySelector(".magnifier-lens");
  const zoomResult = document.querySelector(".zoom-result");

  const zoomLevel = 2.5;

  if (imageWrapper && typeof moveLens === "function") {
    imageWrapper.addEventListener("mousemove", moveLens);
  }

  // show/hide lens and zoom preview on hover
  if (imageWrapper) {
    imageWrapper.addEventListener("mouseenter", () => {
      if (!lens || !zoomResult || !image) return;
      lens.style.opacity = "1";
      zoomResult.style.opacity = "1";
      zoomResult.style.backgroundImage = `url(${image.src})`;
    });

    imageWrapper.addEventListener("mouseleave", () => {
      if (!lens || !zoomResult) return;
      lens.style.opacity = "0";
      zoomResult.style.opacity = "0";
    });
  }

  // compute and position the magnifier lens and zoom background
  function moveLens(e) {
    if (!image || !lens || !zoomResult) return;

    const rect = image.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensWidth = lens.offsetWidth / 2;
    const lensHeight = lens.offsetHeight / 2;

    let lensX = x - lensWidth;
    let lensY = y - lensHeight;

    lensX = Math.max(0, Math.min(lensX, rect.width - lens.offsetWidth));
    lensY = Math.max(0, Math.min(lensY, rect.height - lens.offsetHeight));

    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;

    zoomResult.style.backgroundSize = `${rect.width * zoomLevel}px ${rect.height * zoomLevel}px`;

    const bgPosX = -x * zoomLevel + zoomResult.offsetWidth / 2;
    const bgPosY = -y * zoomLevel + zoomResult.offsetHeight / 2;

    zoomResult.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  }
});
