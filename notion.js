main();

function main() {
    chrome.storage.local.get(['notionName', 'notionTeam'], (result) => {
        checkWorkState(result.notionName, result.notionTeam);
    });
}

function checkWorkState(name, team) {
    

    const iframes = document.getElementsByTagName("iframe");
    var workPlanDoc = null;
    for (let i = 0; i < iframes.length; ++i) {
        if (iframes[i].src == "https://gwa.oneunivrs.com/yjmgames/portlet/ftPortletForm") {
            workPlanDoc = iframes[i].contentDocument;
        }
    }

    if (workPlanDoc == null) {
        return;
    }

    const enterTime = workPlanDoc.getElementById("comeTm").innerText;
    const exitTime = workPlanDoc.getElementById("leaveTm").innerText;

    var workState = "unknown";

    if (enterTime == "출근") {
        workState = "before_work";
    } else if (enterTime != "출근" && exitTime == "퇴근") {
        workState = "working";
    } else if (enterTime != "출근" && exitTime != "퇴근") {
        workState = "after_work";
    }

    chrome.storage.local.get(['workState'], (result) => {
        if (workState != result.workState) {
            sendNotion(name, team, workState);
        } else {
            console.log("same work state");
        }
    });
}

function sendNotion(name, team, workState) {
    console.log(name);
    console.log(team);
    console.log(workState);

    chrome.storage.local.set({ workState });
}