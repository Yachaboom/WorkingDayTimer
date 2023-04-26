dataLoadTab = null;

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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (tab.url == "https://gwa.oneunivrs.com/gw/userMain.do") {
        if (changeInfo.status == "complete") {
            dataLoadTab = null;
            chrome.tabs.get(tabId, WorkDataLoad)
        }
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (dataLoadTab != null, request.message === 'page_loaded' && sender.tab.id == dataLoadTab.id) {
        const workdata = request.content;
        chrome.storage.local.set({ workdata });
        chrome.tabs.remove(sender.tab.id);
        chrome.tabs.query({ url: "https://gwa.oneunivrs.com/gw/userMain.do" }, (tabs) => {
            if (tabs.length === 0) {
                return;
            }

            for (let i = 0 ; i < tabs.length ; ++i) {
                UpdateWorkTimer(tabs[i]);
            }
        });
    }
});

function openUrlAndWaitForLoad(url) {
    chrome.tabs.create({ url: url, active: false }, onOpenDataTab);
}

function onOpenDataTab(tab) {
    if (dataLoadTab != null) {
        chrome.tabs.remove(dataLoadTab.id);
    }

    dataLoadTab = tab;
}




