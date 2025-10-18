// Youtube.js
/* TODO
    Add url detection changes to stop viewing of shorts
    Fix Bug of shorts nav sometimes not getting hit
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

    // For removing the shorts tab on user pages
    const tabsInnerContainer = document.getElementById("tabs-inner-container");
    if (tabsInnerContainer) {
        tabsInnerContainer.querySelectorAll('[tab-title="Shorts"]').forEach(tab => {
            if (tab) {
                console.log("hit");
                tab.remove();
            }
        });
    }

    console.log(++count);
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {         
            throttledRemoval(mutation.addedNodes[0]);
            break;
        }
    }
});

// Will call the function to remove shorts at most every however long limit is (usually 500ms)
function throttledRemoval (node) {
    now = Date.now();
    if (now - lastRan > limit) {
        lastRan = now;
        if (checkCommonTrigger(node)) {
            removeShorts();
        }
    }
    else {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            lastRan = Date.now();
            if (checkCommonTrigger(node)) {
                removeShorts();
            }
        }, limit - (now - lastRan));
    }
}

// Checks if mutation is a common trigger unrelated to shorts which are the main ones that run on document idle
function checkCommonTrigger(node) {

    // Check node type is actually an element
    if (node.nodeType != Node.ELEMENT_NODE) {
        return false;
    }
    
    // Hover over a video
    if (node.tagName == "YT-THUMBNAIL-OVERLAY-BADGE-VIEW-MODEL") {
        return false;
    }

    // Empty divs when hovering over a video
    // Note: Lowercase names here so useing localNames
    if (node.tagName == "DIV" && node.children.length == 1) {
        const svgElement = node.firstElementChild;
        if (svgElement.localName == "svg" && svgElement.children.length == 1) {
            const pathElement = svgElement.firstElementChild;
            if (pathElement.localName == "path" && pathElement.children.length == 0) {
                return false;
            }
        }
    }

    // Hover over description
    if (node.className == "yt-core-attributed-string--link-inherit-color" || node.className == "yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap" || node.classname == "yt-core-attributed-string__list-group") {
        return false;
    }
    
    // Captions in video playback
    if (node.className == "caption-visual-line" || node.className == "caption-window ytp-caption-window-bottom") {
        return false;
    }

    // Hover over a video in search
    if (node.tagName == "YTD-THUMBNAIL-OVERLAY-TOGGLE-BUTTON-RENDERER" || node.className == "yt-icon-shape style-scope yt-icon ytSpecIconShapeHost") {
        return false;
    }

    // Quick shorts URL check 
    urlCheck();

    console.log(node);
    return true;
}

// Replace shorts URLs with youtube home page
function urlCheck() {
    const URL = location.href;
    if (URL.startsWith("https://www.youtube.com/shorts/")) {
        location.replace("https://www.youtube.com");
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

// Do a once over check on load
urlCheck();
removeShorts();