function UpdateWorkTimer(tab) {

    if (tab.url == "https://gwa.oneunivrs.com/gw/userMain.do") {
        chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            files: ['calc.js']
        });
    }
}

function WorkDataLoad(tab) {
    if (tab.url == "https://gwa.oneunivrs.com/gw/userMain.do") {
        openUrlAndWaitForLoad("https://gwa.oneunivrs.com/yjmgames/ft/ftCalendarForm");
    }
}

/*chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, UpdateWorkTimer)
});*/

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (tab.url == "https://gwa.oneunivrs.com/gw/userMain.do") {
        if (changeInfo.status == "complete") {
            chrome.tabs.get(tabId, WorkDataLoad)
        }
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'page_loaded') {
        const workdata = request.content;
        //chrome.storage.local.set({ workdata });
        //console.log('Page content:', request.content);
        // Do something with the page content
        chrome.tabs.remove(sender.tab.id);
//        const myData = { message: 'Hello from the extension!' };
        chrome.storage.local.set({workdata});

        chrome.tabs.query({ url: "https://gwa.oneunivrs.com/gw/userMain.do" }, (tabs) => {
            if (tabs.length === 0) {
                return;
            }
            const tab = tabs[0];
            UpdateWorkTimer(tab);
        });
    }
});

function openUrlAndWaitForLoad(url) {
    chrome.tabs.create({ url: url, active: false });
}

// Example usage:




