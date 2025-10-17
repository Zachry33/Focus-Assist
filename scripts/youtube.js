// Youtube.js
/* TODO
    Maybe quick check for common triggers
    Add url detection changes to stop viewing of shorts
    Add disconnection of observer after a period of shorts not being loaded as shorts very likly wont be loaded after that
*/


var count = 0;
let lastRan = Date.now();
let now;
// min 500ms between removals
const limit = 500;
let timeoutID;

// Find and remove shorts content on page
function removeShorts () {

    // For shorts navigation sidebar
    const navBarItems = document.getElementById("items");
    if (navBarItems) {
        navBarItems.querySelectorAll('[title="Shorts"]').forEach(shortsNav => {
            if (shortsNav) {
                console.log("hit");
                shortsNav.remove();
            }
        });
    }

    // For shorts in vertical carousels on home page
    const pageManager = document.getElementById("page-manager");
    if (pageManager) {
        pageManager.querySelectorAll('[is-shorts]').forEach(short => {
            if (short) {
                console.log("hit");
                short.remove();
            }
        });
    }

    // For shorts using this remix
    const related = document.getElementById("related");
    if (related) {
        related.querySelectorAll('[class="style-scope ytd-reel-shelf-renderer"]').forEach(reel => {
            if (reel) {
                console.log("hit");
                reel.remove();
            }
        });
    }

    // For shorts in vertical carousels after search
    if (pageManager) {
        pageManager.querySelectorAll('[class="shortsLockupViewModelHost"]').forEach(shortsLockup => {
            if (shortsLockup) {
                console.log("hit");
                const shortsLockupContainer = shortsLockup.closest('grid-shelf-view-model');
                if (shortsLockupContainer) {
                    shortsLockupContainer.remove();
                }
            }
        });
    }

    // For shorts in the normal video thumbnail but are type shorts (has shorts tag on thumbnail)
    if (pageManager) {
        pageManager.querySelectorAll('[overlay-style="SHORTS"]').forEach(shortsOverlay => {
            if (shortsOverlay) {
                console.log("hit");
                const shortsOverlayContainer = shortsOverlay.closest('ytd-video-renderer');
                if (shortsOverlayContainer) {
                    shortsOverlayContainer.remove();
                }
            }
        });
    }

    // For shorts in the normal video thumbnail but are type shorts (no shorts tag on thumbnail) ytd-compact-video-renderer 
    if (pageManager) {
        pageManager.querySelectorAll('[class="style-scope ytd-compact-video-renderer"]').forEach(shortsThumbnail => {
            if (shortsThumbnail) {
                shortsThumbnail.remove();
            }
        });
    }


    // For removing the shorts filters chip button in search results
    const chipBar = document.getElementById("chip-bar");
    if (chipBar) {
        chipBar.querySelectorAll('[class^="ytChipShapeChip"]').forEach(chipButton => {
            if (chipButton) {
                if (chipButton.textContent == "Shorts") {
                    console.log("hit");
                    const shortsFilter = chipButton.closest('chip-shape');
                    if (shortsFilter) {
                        shortsFilter.remove();
                    }
                }
            }
        });
    }

    console.log(++count);
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {         
            throttledRemoval(mutation.addedNodes);
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
let content = document.getElementById("content");
if (!content) {
    content = document.body; 
}
observer.observe(content, {
    childList: true,
    subtree: true,
});

removeShorts();