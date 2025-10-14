// Youtube.js
/* TODO
    Improve performance of querySelectorAll by perhaps using getElementByID on id="content"
    Fix bug of reloaded page in video viewer not finding content element
    Add url detection changes to stop viewing of shorts
*/


var count = 0;
let lastRan = Date.now();
let now;
const limit = 500;
let timeoutID;

// Find and remove shorts content on page
function removeShorts () {

    // For shorts navigation sidebar
    document.querySelectorAll('[title="Shorts"]').forEach(shortsNav => {
        if (shortsNav) {
            console.log("hit");
            shortsNav.remove();
        }
    });

    // For shorts in vertical carousels on home page
    document.querySelectorAll('[is-shorts]').forEach(short => {
        if (short) {
            console.log("hit");
            short.remove();
        }
    });

    // For shorts using this remix
    document.querySelectorAll('[class="style-scope ytd-reel-shelf-renderer"]').forEach(reel => {
        if (reel) {
            console.log("hit");
            reel.remove();
        }
    });

    // For shorts in vertical carousels after search
    document.querySelectorAll('[class="shortsLockupViewModelHost"]').forEach(shortsLockup => {
        if (shortsLockup) {
            console.log("hit");
            const shortsLockupContainer = shortsLockup.closest('grid-shelf-view-model');
            if (shortsLockupContainer) {
                shortsLockupContainer.remove();
            }
        }
    });

    // For shorts in the normal video thumbnail but are type shorts (has shorts tag on thumbnail)
    document.querySelectorAll('[overlay-style="SHORTS"]').forEach(shortsOverlay => {
        if (shortsOverlay) {
            console.log("hit");
            const shortsOverlayContainer = shortsOverlay.closest('ytd-video-renderer');
            if (shortsOverlayContainer) {
                shortsOverlayContainer.remove();
            }
        }
    });

    console.log(++count);
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