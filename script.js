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
});
