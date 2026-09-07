// twitter.js

let lastRan = Date.now();
const LIMIT = 500;
let timeoutID;
let numTweets = 0;
const MAX_TWEETS = 30;
const seenTweetIds = new Set();

// Function to process or count tweets
function handleTwitterFeed(node) {
    
    console.log(numTweets);

    // If reached max tweets, just return
    if (numTweets > MAX_TWEETS) {
        lockFeed();
        return;
    }

    // If the user clicked into a specific tweet thread, don't count or delete replies
    if (window.location.pathname.includes('/status/')) {
        return;
    }

    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    let tweetsFound = false;

    tweets.forEach(tweet => {

        // Check to see if it is an ad which should not count towards the count and shouldnt leave the processed tag
        if (isPromotedTweet(tweet)) {
            return;
        }

        // Obtain the tweet id
        const id = getTweetId(tweet);

        // Check if we've already processed this specific tweet element
        if (id) {
            if (!seenTweetIds.has(id)) {
                seenTweetIds.add(id);
                if (!tweetsFound) {
                    numTweets++;
                    tweetsFound = true;
                }
            }
        } else {
            // Fallback for tweets where an ID cant be found
            if (!tweet.dataset.focusAssistProcessed) {
                tweet.dataset.focusAssistProcessed = "true";
                if (!tweetsFound) {
                    numTweets++;
                    tweetsFound = true;
                }
            }
        }
    });

    // Once the limit is exceeded, lock the feed
    if (numTweets > MAX_TWEETS) {
        lockFeed();
    }
}

// Detect promoted / ad tweets so they are excluded from counting entirely
function isPromotedTweet(tweet) {

    if (tweet.closest('[data-testid="placementTracking"]')) {
        return true;
    }
 
    return false;
}

// Obtain the tweet Id from the tweet
function getTweetId(tweet) {
    // Find the tweets time and the parent element should be the targeted element that contains the anchor element that has the id
    const timeEl = tweet.querySelector('time');
    const anchor = timeEl ? timeEl.closest('a[href*="/status/"]') : null;
    if (anchor) {
        const match = anchor.getAttribute('href')?.match(/\/status\/(\d+)/);
        if (match) return match[1];
    }
    return null;
}


// Find the scrollable timeline container and replace it with a static blocker
function lockFeed() {

    // If the overlay is already present do nothing
    if (document.getElementById("focus-assist-overlay")) {
        // Reapply the scroll backstop in case an SPA nav reset it
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        return;
    }
    
    // Try to find the primary collumn region Twitter scrolls/populates
    const container =
        document.querySelector('div[data-testid="primaryColumn"]');

    if (container) {
       // Make sure the overlay positions relative to this container
        if (getComputedStyle(container).position === "static") {
            container.style.position = "relative";
        }
        container.prepend(buildBlockerOverlay());
    }

    // Backstop: prevent page scroll so the user can't trigger anything else nearby
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
}

function buildBlockerOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "focus-assist-overlay";
    overlay.style.position = "absolute";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483647";
    overlay.style.background = "#ffffff";
    overlay.style.display = "flex";
    overlay.style.alignItems = "flex-start";
    overlay.style.justifyContent = "center";
    overlay.style.paddingTop = "80px";
    overlay.style.paddingLeft = "20px";
    overlay.style.paddingRight = "20px";
    overlay.style.textAlign = "center";
    overlay.style.fontSize = "20px";
    overlay.style.fontWeight = "bold";
    overlay.style.color = "#536471";
    overlay.innerText = `You've reached your Focus Assist limit of ${MAX_TWEETS} tweets for this session.`;
    return overlay;
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