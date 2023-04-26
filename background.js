calendarTab = null;
infoTab = null;

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
        openCalendarTab("https://gwa.oneunivrs.com/yjmgames/ft/ftCalendarForm");
    }
}

function InfoDataLoad(tab) {
    if (tab.url == "https://gwa.oneunivrs.com/gw/userMain.do") {
        openInfoTab("https://gwa.oneunivrs.com/gw/cmm/systemx/myInfoManage.do");
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (tab.url == "https://gwa.oneunivrs.com/gw/userMain.do") {
        if (changeInfo.status == "complete") {
            calendarTab = null;
            //chrome.tabs.get(tabId, WorkDataLoad);
            openCalendarTab("https://gwa.oneunivrs.com/yjmgames/ft/ftCalendarForm");

            infoTab = null;
            openInfoTab("https://gwa.oneunivrs.com/gw/cmm/systemx/myInfoManage.do");
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (infoTab != null, request.message === 'info_loaded' && sender.tab.id == infoTab.id) {
        const notionName = request.content.name;
        const notionTeam = request.content.team;
        chrome.storage.local.set({ notionName, notionTeam });
        chrome.tabs.remove(sender.tab.id);

        console.log(notionName);
        console.log(notionTeam);        
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

function openInfoTab(url) {
    chrome.tabs.create({ url: url, active: false }, onOpenInfoTab);
}

function onOpenInfoTab(tab) {
    if (infoTab != null) {
        chrome.tabs.remove(infoTab.id);
    }

    infoTab = tab;
}


