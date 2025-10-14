//Youtube.js

// Find and remove short option from nav on home page
function removeNav () {
    const shortsNav = document.querySelector('[title="Shorts"]');
    console.log(shortsNav);
    if (shortsNav) {
        shortsNav.remove();
    }
}

const observer = new MutationObserver(() => {
    removeNav();
    removeShorts();
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true,
});

function removeShorts () {
    const short = document.querySelector('[is-shorts]');
    if (short) {
        short.remove();
    }
    
    const reel = document.querySelector('[class="style-scope ytd-reel-shelf-renderer"]')
    if (reel) {
        reel.remove();
    }
}

removeShorts();
removeNav();