function UpdateWorkTimer(tab) {
    if (tab.url == "https://bom-bus.hanbiro.net/nhr/hr/timecard/dashboard?mode=user" || tab.url == "https://bom-bus.hanbiro.net/ngw/app/#/nhr") {
    chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },
            files : ['calc.js']
        });
    }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, UpdateWorkTimer)
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "complete") {
        chrome.tabs.get(tabId, UpdateWorkTimer)
    }
})