document.addEventListener("DOMContentLoaded", () => {
  const marqueeTrack = document.querySelector(".marquee-track");

  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  const headerWrapper = document.querySelector(".header-wrapper");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      headerWrapper.classList.add("hide");
    } else {
      headerWrapper.classList.remove("hide");
    }

    lastScrollY = currentScrollY;
  });

  const downloadBtn = document.getElementById("downloadDatasheetBtn");
  const modalOverlay = document.getElementById("datasheetModal");
  const modalClose = modalOverlay.querySelector(".modal-close");
  const modalForm = modalOverlay.querySelector(".modal-form");

  const openModal = () => {
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
  };

  downloadBtn.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  // Form validation for download button
  const emailInput = modalForm.querySelector('input[name="email"]');
  const phoneInput = modalForm.querySelector('input[name="phone"]');
  const submitBtn = modalForm.querySelector('button[type="submit"]');

  const validateForm = () => {
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

  emailInput.addEventListener("input", validateForm);
  phoneInput.addEventListener("input", validateForm);
  emailInput.addEventListener("blur", validateForm);
  phoneInput.addEventListener("blur", validateForm);

  validateForm();

  modalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    closeModal();
  });
});
