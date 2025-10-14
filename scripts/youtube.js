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
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true,
});

removeNav();