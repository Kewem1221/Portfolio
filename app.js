// =========== global =============
// We create the disableselect function that returns false
// and set that as the value of the document.onselectstart
const disableselect = (e) => {
  return false;
};

document.onselectstart = disableselect;

// =========== header =============

const navLinks = document.querySelector(".nav-links");
const navBtn = document.querySelector(".nav-btn");
const themeBtn = document.querySelector(".theme-btn");
const links = document.querySelectorAll(".nav-links a");
const header = document.querySelector("header");

navBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show-nav-links");
  header.classList.add("add-bg");
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("show-nav-links");
});

themeBtn.addEventListener("click", () => {
  const body = document.querySelector("body");
  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    themeBtn.innerHTML = "<i class='uil uil-moon'></i>";
  } else {
    body.classList.add("dark-theme");
    themeBtn.innerHTML = "<i class='uil uil-sun'></i>";
  }
});

window.addEventListener("scroll", () => {
  const homeHeight = document.getElementById("home").clientHeight;
  if (window.scrollY > homeHeight - 64) header.classList.add("add-bg");
  else header.classList.remove("add-bg");
});

// Scroll to the right position
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").slice(1);
    const navHeight = document.querySelector(".nav-center").clientHeight;
    const targetOffsetTop = document.getElementById(targetId).offsetTop;
    window.scrollTo({ left: 0, top: targetOffsetTop - 64 });
  });
});

// ============ projects ==============

const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const pagination = document.querySelector(".pagination");
const bullets = [];

// Set up slide state
let currentSlideIndex = 0;
let lastTranslateX = 0;
let currentTouchX = 0;
let animationId;
let xStart = 0;
let isDragging = false;

function addPageBullets() {
  for (let i = 0; i < slides.length; i++) {
    let bullet = document.createElement("span");
    bullet.classList.add("bullet");

    bullet.addEventListener("click", () => {
      currentSlideIndex = i;
      lastTranslateX = -window.innerWidth * currentSlideIndex;
      setSlideByIndex();
      setBulletColor();
    });

    pagination.appendChild(bullet);
    bullets.push(bullet);
  }
}

function setBulletColor() {
  bullets.forEach((bullet) => {
    bullet.style.backgroundColor = "var(--text-color-2)";
  });
  bullets[currentSlideIndex].style.backgroundColor = "var(--text-color-1)";
}

function getPositionX(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
}

function animateSlide() {
  if (isDragging) {
    const currentTranslateX = lastTranslateX + currentTouchX - xStart;
    slider.style.transform = `translateX(${currentTranslateX}px)`;
    requestAnimationFrame(animateSlide);
  }
}

function setSlideByIndex() {
  lastTranslateX = -window.innerWidth * currentSlideIndex;
  slider.style.transform = `translateX(${lastTranslateX}px)`;
}

function touchStart(e) {
  isDragging = true;
  xStart = getPositionX(e);
  currentTouchX = xStart;
  slides.forEach((slide) => {
    slide.classList.add("scale");
  });
  animationId = requestAnimationFrame(animateSlide);
}

function touchMove(e) {
  currentTouchX = getPositionX(e);
}

function touchend() {
  isDragging = false;
  slides.forEach((slide) => {
    slide.classList.remove("scale");
  });
  cancelAnimationFrame(animationId);
  const dragDistance = currentTouchX - xStart;

  if (dragDistance < -100 && currentSlideIndex < slides.length - 1)
    currentSlideIndex += 1;
  if (dragDistance > 100 && currentSlideIndex > 0) currentSlideIndex -= 1;

  setSlideByIndex();
  setBulletColor();
}

addPageBullets();
setBulletColor();

slider.addEventListener("mousedown", touchStart);
slider.addEventListener("mousemove", touchMove);
slider.addEventListener("mouseup", touchend);

slider.addEventListener("touchstart", touchStart);
slider.addEventListener("touchmove", touchMove);
slider.addEventListener("touchend", touchend);

// make responsive to viewport changes
window.addEventListener("resize", setSlideByIndex);

// Prevent images from being dragged
document.querySelectorAll(".slide-img").forEach((img) => {
  img.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });
});
