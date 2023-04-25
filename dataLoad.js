window.addEventListener('load', () => {
    if (window.location.href == "https://gwa.oneunivrs.com/yjmgames/ft/ftCalendarForm") {
        setTimeout(() => {
            const pageContent = document.documentElement.outerHTML;
            chrome.runtime.sendMessage({ message: 'page_loaded', content: pageContent });
        }, 5000); // Adjust the delay as needed to wait for JavaScript to finish executing
    }
});
