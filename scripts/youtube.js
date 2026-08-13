// youtube.js

var count = 0;
let lastRan = Date.now();
let now;
// min 500ms between removals
const LIMIT = 500;
let timeoutID;

// Find and remove shorts content on page
function removeShorts () {

    // For shorts navigation sidebar
    const navBarItems = document.getElementById("items");
    if (navBarItems) {
        navBarItems.querySelectorAll('[title="Shorts"]').forEach(shortsNav => {
            if (shortsNav) {
                shortsNav.remove();
            }
        });
    }

    // For shorts in vertical carousels on home page
    const pageManager = document.getElementById("page-manager");
    if (pageManager) {
        pageManager.querySelectorAll('[is-shorts]').forEach(short => {
            if (short) {
                short.remove();
            }
        });
    }

    // For shorts using this remix
    const related = document.getElementById("related");
    if (related) {
        related.querySelectorAll('[class="style-scope ytd-reel-shelf-renderer"]').forEach(reel => {
            if (reel) {
                reel.remove();
            }
        });
    }

    // For shorts in vertical carousels after search
    if (pageManager) {
        pageManager.querySelectorAll('[class="shortsLockupViewModelHost"]').forEach(shortsLockup => {
            if (shortsLockup) {
                const shortsLockupContainer = shortsLockup.closest('grid-shelf-view-model');
                if (shortsLockupContainer) {
                    shortsLockupContainer.remove();
                }
            }
        });
    }

    // For removing the shorts carousel on user pages
    if (pageManager) {
        pageManager.querySelectorAll('[class="style-scope ytd-reel-shelf-renderer"]').forEach(reelShelfRenderer => {
            if (reelShelfRenderer) {
                const itemlistRenderer = reelShelfRenderer.closest('ytd-item-section-renderer');
                if (itemlistRenderer) {
                    itemlistRenderer.remove();
                }
            }
        });
    }


    // For shorts in the normal video thumbnail but are type shorts (has shorts tag on thumbnail)
    if (pageManager) {
        pageManager.querySelectorAll('[overlay-style="SHORTS"]').forEach(shortsOverlay => {
            if (shortsOverlay) {
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
                // The tab needs to still exist for other yt functions
                tab.style.display = 'none';
                // Adjust the slider position if removed 
                tabsInnerContainer.querySelectorAll('[class="tabGroupShapeSlider tabGroupShapeSliderTransition"]').forEach(slider => {
                    if (slider) { 
                        // Check parent element is not a wrapper
                        const parent = slider.parentElement;
                        const loc = location.href;
                        const lastSlashIndex = loc.lastIndexOf("/");
                        if (parent.className != 'wrap') {
                            const wrapper = document.createElement('div');
                            // Shift the wrapper instead of slider since slider style is constantly changing)
                            if (loc.endsWith("/videos") || loc.endsWith("/featured") || (lastSlashIndex != -1 && loc.charAt(lastSlashIndex + 1) == "@")) {
                                wrapper.style.setProperty('margin-left', '0px');
                            }
                            else {
                                wrapper.style.setProperty('margin-left', '-24px');
                            }

                            wrapper.className = 'wrap';

                            slider.parentNode.insertBefore(wrapper, slider);
                            wrapper.appendChild(slider);
                        }
                        // if parent is already a wrapper update it
                        else {
                            if (loc.endsWith("/videos") || loc.endsWith("/featured") || (lastSlashIndex != -1 && loc.charAt(lastSlashIndex + 1) == "@")) {
                                parent.style.setProperty('margin-left', '0px');
                            }
                            else {
                                parent.style.setProperty('margin-left', '-24px');
                            }
                        }
                    }
                });
            }
        });
    }
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {         
            throttledRemoval(mutation.addedNodes[0]);
            break;
        }
    }
});

// Will call the function to remove shorts at most every however long LIMIT is (usually 500ms)
function throttledRemoval (node) {
    now = Date.now();
    //Checks to see if the last time remove shorts is greater than the LIMIT and will run it again if it is
    if (now - lastRan > LIMIT) {
        lastRan = now;
        if (checkCommonTrigger(node)) {
            removeShorts();
        }
    }
    // Otherwise, it will run after 500ms have passed since it last ran
    else {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            lastRan = Date.now();
            if (checkCommonTrigger(node)) {
                removeShorts();
            }
        }, LIMIT - (now - lastRan));
    }
}

// Checks if mutation is a common trigger unrelated to shorts which are the main ones that run on document idle
function checkCommonTrigger(node) {

    // Check node type is actually an element
    if (node.nodeType != Node.ELEMENT_NODE) {
        return false;
    }

    const tagName = node.tagName;
    const className = node.className;
    
    // Hover over a video
    if (tagName == "YT-THUMBNAIL-OVERLAY-BADGE-VIEW-MODEL") {
        return false;
    }

    // Empty divs when hovering over a video
    // Note: Lowercase names here so useing localNames
    if (tagName == "DIV" && node.children.length == 1) {
        const svgElement = node.firstElementChild;
        if (svgElement.localName == "svg" && svgElement.children.length == 1) {
            const pathElement = svgElement.firstElementChild;
            if (pathElement.localName == "path" && pathElement.children.length == 0) {
                return false;
            }
        }
    }

    // Hover over description
    if (className == "yt-core-attributed-string--link-inherit-color" || className == "yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap" || className == "yt-core-attributed-string__list-group") {
        return false;
    }
    
    // Captions in video playback
    if (className == "caption-visual-line" || className == "caption-window ytp-caption-window-bottom") {
        return false;
    }

    // Hover over a video in search
    if (tagName == "YTD-THUMBNAIL-OVERLAY-TOGGLE-BUTTON-RENDERER" || className == "yt-icon-shape style-scope yt-icon ytSpecIconShapeHost") {
        return false;
    }

    // Quick shorts URL check 
    urlCheck();

    return true;
}

// Replace shorts URLs with youtube home page
function urlCheck() {
    const URL = location.href;
    if (URL.startsWith("https://www.youtube.com/shorts/")) {
        location.replace("https://www.youtube.com");
    }
}

// When youtube finishes navigating
document.addEventListener('yt-navigate-finish', (event) => {
    urlCheck();
    removeShorts();
});

// Start observing
let content = document.getElementById("content");
if (!content) {
    content = document; 
}
observer.observe(content, {
    childList: true,
    subtree: true,
});

// Do a once over check on load
urlCheck();
removeShorts();