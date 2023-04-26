function waitForCondition(conditionFunc, interval = 500, timeout = 5000) {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
        const checkCondition = () => {
            if (conditionFunc()) {
                resolve();
            } else if (Date.now() - startTime > timeout) {
                reject(new Error('Timeout waiting for condition'));
            } else {
                setTimeout(checkCondition, interval);
            }
        };

        checkCondition();
    });
}

window.addEventListener('load', () => {
    if (window.location.href == "https://gwa.oneunivrs.com/yjmgames/ft/ftCalendarForm") {
            const tableLoaded = () => {
            const table = document.querySelector(".calender");
            if (table == null) {
                return false;
            }

            const tableBody = table.querySelector("tbody");
            if (tableBody == null) {
                return false;
            }

            return tableBody.childElementCount > 3;
        };

        waitForCondition(tableLoaded)
            .then(() => {
                const pageContent = document.documentElement.outerHTML;
                chrome.runtime.sendMessage({ message: 'page_loaded', content: pageContent });                
            })
            .catch((error) => {
                console.error('Failed to wait for the condition:', error);
            });
    }
});
