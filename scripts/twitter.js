// twitter.js

let lastRan = Date.now();
const LIMIT = 500;
let timeoutID;
let numTweets = 0;
const MAX_TWEETS = 30;

// Function to process or count tweets
function handleTwitterFeed(node) {
    
    console.log(numTweets);

    // If we've been redirected to settings, show the banner and stop tracking feed
    if (window.location.pathname.includes('/settings') && numTweets > MAX_TWEETS) {
        showSettingsBanner();
        return;
    }

    // If the user clicked into a specific tweet thread, don't count or delete replies
    if (window.location.pathname.includes('/status/')) {
        return;
    }

    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    let tweetsFound = false;

    tweets.forEach(tweet => {
        // Check if we've already processed this specific tweet element
        if (!tweet.dataset.focusAssistProcessed) {
            tweet.dataset.focusAssistProcessed = "true";
            if (!tweetsFound) {
                numTweets++;
                tweetsFound = true;
            }
        }
    });

    // Once the limit is exceeded, go to settings page
    if (numTweets > MAX_TWEETS) {
        // Trigger an SPA navigation to settings without a full reload
        history.pushState({}, "", "/settings/account");
        window.dispatchEvent(new PopStateEvent("popstate"));
    }
}

function showSettingsBanner() {
    // If banner already shown
    if (document.getElementById("focus-assist-limit-banner")) return;

    // Optional: Hide the main settings content or just show a top banner
    const banner = document.createElement("div");
    banner.id = "focus-assist-limit-banner";
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.padding = "20px";
    banner.style.textAlign = "center";
    banner.style.fontSize = "18px";
    banner.style.fontWeight = "bold";
    banner.style.color = "#ffffff";
    banner.style.background = "#e0245e";
    banner.style.zIndex = "999999";
    banner.innerText = "🛑 Focus Assist: You've reached the limit of 30 tweets";
    
    document.body.prepend(banner);
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {        
            throttledExecution(mutation.addedNodes[0]);
            break;
        }
    }
});

// Same throttling pattern as in youtube.js
// Will wait to run again for 500ms
function throttledExecution(node) {
    const now = Date.now();
    if (now - lastRan > LIMIT) {
        lastRan = now;
        handleTwitterFeed(node);
    } else {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            lastRan = Date.now();
            handleTwitterFeed(node);
        }, LIMIT - (now - lastRan));
    }
}

// Start observing the body
observer.observe(document, {
    childList: true,
    subtree: true,
});

// Initial run on load
handleTwitterFeed();