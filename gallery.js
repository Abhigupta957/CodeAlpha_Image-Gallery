// The lightbox popup and its inner parts
var lightbox      = document.getElementById("lightbox");
var lbImage       = document.getElementById("lb-img");
var lbTitle       = document.getElementById("lb-title");
var lbCounter     = document.getElementById("lb-counter");
var lbCloseBtn    = document.getElementById("lb-close");
var lbPrevBtn     = document.getElementById("lb-prev");
var lbNextBtn     = document.getElementById("lb-next");

// All the category filter buttons (
var filterButtons = document.querySelectorAll(".filter-btn");

// All the image filter buttons inside the lightbox 
var imgFilterBtns = document.querySelectorAll(".img-filter-btn");

// All the image cards in the gallery
var allCards = Array.from(document.querySelectorAll(".gallery-item"));


/* VARIABLES TO TRACK CURRENT STATE */

// The list of cards currently visible
var visibleCards = [];

// e.g. 0 = first image, 1 = second image, etc.
var currentIndex = 0;

// user's finger started when swiping on mobile
var touchStartX = 0;


/* CATEGORY FILTER FUNCTION */

function applyFilter(selectedCategory) {

  // Update which filter button looks "active" 
  filterButtons.forEach(function(btn) {
    // Remove "active" from all buttons first
    btn.classList.remove("active");

    // Add "active" only to the button that was clicked
    if (btn.dataset.filter === selectedCategory) {
      btn.classList.add("active");
    }
  });

  // Show or hide each image card
  allCards.forEach(function(card) {

    // "all" means show everything
    var shouldShow = (selectedCategory === "all") ||
                     (card.dataset.category === selectedCategory);

    if (shouldShow) {
      card.classList.remove("hidden");  
    } else {
      card.classList.add("hidden");     
    }
  });

  // Update the visibleCards list 
  visibleCards = allCards.filter(function(card) {
    return !card.classList.contains("hidden");
  });
}

// Attach a click listener to every filter button
filterButtons.forEach(function(btn) {
  btn.addEventListener("click", function() {
    applyFilter(btn.dataset.filter);
  });
});


/* OPEN THE LIGHTBOX */

function openLightbox(card) {

  // Find the position of this card in the visible list
  var index = visibleCards.indexOf(card);

  // If the card isn't in the visible list, do nothing
  if (index === -1) return;

  // Remember which image we're on
  currentIndex = index;

  // Load the image into the lightbox
  showImageInLightbox();

  // Show the lightbox 
  lightbox.hidden = false;

  // page scrolling while lightbox is open
  document.body.style.overflow = "hidden";

  // Move keyboard to the close button
  lbCloseBtn.focus();
}


/* SHOW THE CURRENT IMAGE IN THE LIGHTBOX */

function showImageInLightbox() {

  var card  = visibleCards[currentIndex];
  var img   = card.querySelector("img");
  var title = card.querySelector(".image-title").textContent;

  // Fade the image out, in and swap the src
  lbImage.style.opacity = "0";

  setTimeout(function() {
    lbImage.src = img.src;
    lbImage.alt = img.alt;
    lbImage.style.opacity = "1";
  }, 150);

  // Update title text
  lbTitle.textContent = title;

  // Update counter, e.g. "3 / 24"
  lbCounter.textContent = (currentIndex + 1) + " / " + visibleCards.length;

  // Reset the image 
  resetImageFilter();
}


/* CLOSE THE LIGHTBOX */

function closeLightbox() {

  // Hide the lightbox
  lightbox.hidden = true;

  // page to scroll again
  document.body.style.overflow = "";

  if (visibleCards[currentIndex]) {
    visibleCards[currentIndex].focus();
  }
}


/*  NAVIGATE BETWEEN IMAGES */

function navigate(direction) {
  currentIndex = (currentIndex + direction + visibleCards.length) % visibleCards.length;
  showImageInLightbox();
}


/* ATTACH EVENTS TO LIGHTBOX BUTTONS */

// Close button click
lbCloseBtn.addEventListener("click", closeLightbox);

// Previous button click
lbPrevBtn.addEventListener("click", function() {
  navigate(-1);
});

// Next button click
lbNextBtn.addEventListener("click", function() {
  navigate(1);
});

//  for Clicking the dark background 
lightbox.addEventListener("click", function(event) {
  if (event.target === lightbox) {
    closeLightbox();
  }
});


/* KEYBOARD NAVIGATION */

document.addEventListener("keydown", function(event) {

  // Do nothing if the lightbox is not open
  if (lightbox.hidden) return;

  if (event.key === "Escape")     closeLightbox();
  if (event.key === "ArrowRight") navigate(1);
  if (event.key === "ArrowLeft")  navigate(-1);
});


/* ATTACH CLICK EVENTS TO EACH IMAGE CARD*/

allCards.forEach(function(card) {

  // Mouse click
  card.addEventListener("click", function() {
    openLightbox(card);
  });

  // Keyboard: Enter or Space key (for accessibility)
  card.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();   
      openLightbox(card);
    }
  });
});


/* IMAGE FILTER BUTTONS  */

function resetImageFilter() {
  imgFilterBtns.forEach(function(btn) {
    btn.classList.remove("active");
  });

  imgFilterBtns[0].classList.add("active");

  // Remove any filter from the image
  lbImage.style.filter = "none";
}

imgFilterBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {

    // Remove "active" from all buttons
    imgFilterBtns.forEach(function(b) {
      b.classList.remove("active");
    });

    // Mark this button as active
    btn.classList.add("active");

    // Apply the CSS filter
    lbImage.style.filter = btn.dataset.cssFilter;
  });
});


/*  TOUCH / SWIPE SUPPORT (mobile)*/

lightbox.addEventListener("touchstart", function(event) {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener("touchend", function(event) {
  var touchEndX = event.changedTouches[0].clientX;
  var distance  = touchEndX - touchStartX;

  // for count 
  if (Math.abs(distance) > 50) {
    if (distance < 0) {
      navigate(1);   // swiped left  → next image
    } else {
      navigate(-1);  // swiped right → previous image
    }
  }
}, { passive: true });


/* INITIALISE */

applyFilter("all");
