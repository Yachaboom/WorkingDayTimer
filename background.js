function UpdateWorkTimer(tab) {
    console.log("yachaboom1")
    if (tab.url == "https://gwa.oneunivrs.com/gw/userMain.do") {

    

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
    console.log(changeInfo.status)
    if (changeInfo.status == "complete") {
        chrome.tabs.get(tabId, UpdateWorkTimer)
    }
})

// background.js




  