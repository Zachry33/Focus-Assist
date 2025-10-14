//Youtube.js
var count = 0;
let lastRan = Date.now();
let now;
const limit = 200;
let timeoutID;

// Find and remove shorts content on page
function removeShorts () {

    // For shorts navigation sidebar
    const shortsNav = document.querySelector('[title="Shorts"]');
    console.log(++count);
    if (shortsNav) {
        console.log("hit");
        shortsNav.remove();
    }

    // For shorts in vertical displays
    const short = document.querySelector('[is-shorts]');
    console.log(++count);
    if (short) {
        console.log("hit");
        short.remove();
    }

    // For shorts using this remix
    const reel = document.querySelector('[class="style-scope ytd-reel-shelf-renderer"]');
    console.log(++count);
    if (reel) {
        console.log("hit");
        reel.remove();
    }

    // For shorts
    const shortsLockup = document.querySelector('[class="shortsLockupViewModelHost"]');
    console.log(++count);
    if (shortsLockup) {
        console.log("hit");
        const shortsLockupContainer = shortsLockup.closest('grid-shelf-view-model');
        if (shortsLockupContainer) {
            shortsLockupContainer.remove();
        }
    }

    // For videos in the normal video format but are in shorts style
    const shortsOverlay = document.querySelector('[overlay-style="SHORTS"]');
    console.log(++count);
    if (shortsOverlay) {
        console.log("hit");
        const shortsOverlayContainer = shortsOverlay.closest('ytd-video-renderer');
        if (shortsOverlayContainer) {
            shortsOverlayContainer.remove();
        }
    }
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            throttledRemoval();
            break;
        }
    }
});

function throttledRemoval () {
    now = Date.now();
    if (now - lastRan > limit) {
        lastRan = now;
        removeShorts();
    }
    else {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            lastRan = Date.now();
            removeShorts();
        }, limit - (now - lastRan));
    }
}


// Start observing
const content = document.getElementById("content");
observer.observe(content, {
    childList: true,
    subtree: true,
});

removeShorts();