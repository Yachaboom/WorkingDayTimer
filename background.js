calendarTab = null;

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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (tab.url == "https://gwa.oneunivrs.com/gw/userMain.do") {
        if (changeInfo.status == "complete") {
            calendarTab = null;
            openCalendarTab("https://gwa.oneunivrs.com/yjmgames/ft/ftCalendarForm");
        }
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (calendarTab != null, request.message === 'page_loaded' && sender.tab.id == calendarTab.id) {
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

function openCalendarTab(url) {
    chrome.tabs.create({ url: url, active: false }, onOpenCalendarTab);
}

function onOpenCalendarTab(tab) {
    if (calendarTab != null) {
        chrome.tabs.remove(calendarTab.id);
    }

    calendarTab = tab;
}
