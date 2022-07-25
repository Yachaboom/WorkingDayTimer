TryCalcWorkTime()

function CalcWorkTime() {
    let hrPage = document
    let titleParent = document.getElementById('divMenu')
    if (titleParent == null) {
        hrPage = document.getElementById("nhrIframe").contentDocument
        if (hrPage == null) {
            return
        }

        titleParent = hrPage.getElementById('divMenu')
    }

    if (titleParent == null) {
        return;
    }
    let titleList = titleParent.getElementsByClassName("text-truncate");
    if (titleList == null || titleList.length == 0) {
        return;
    }

    let title = titleList[0];

    let titleAttribute = title.getAttribute("data-lang-id")
    if (titleAttribute != 'tc_menu_dashboard') {
        return;
    }

    var workTime = hrPage.getElementsByClassName("tx-15 work-hours-color report-event-value")[0].innerText
    var regex = /[^0-9]/g
    var workTimeInfo = workTime.split(' ')
    var curWorkTimeMin = Number(workTimeInfo[0].replace(regex, "")) * 60 + Number(workTimeInfo[1].replace(regex, ""))

    var today = new Date();
    var totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    var dayOffInfo = hrPage.getElementsByClassName("tx-15 day-off-color report-event-value");
    var dayOffNum = Number(dayOffInfo[0].innerText.replace(regex, "")) + Number(dayOffInfo[1].innerText.replace(regex, "")) + Number(dayOffInfo[2].innerText.replace(regex, ""))
    var totalWorkingDay = totalDays - dayOffNum
    var workStatusInfo = hrPage.getElementsByClassName("text-center tx-semibold tx-20 ");
    var workOutCount = Number(workStatusInfo[3].innerText.replace(regex, ""));
    var remainWorkDay = totalWorkingDay - workOutCount;
    var totalWorkTimeMin = totalWorkingDay * 8 * 60
    var remainWorkTimeMin = totalWorkTimeMin - curWorkTimeMin

    if (remainWorkDay <= 0) {
        return;
    }

    if (remainWorkTimeMin <= 0) {
        return;
    }

    var remainTimeHour = parseInt(remainWorkTimeMin / 60)
    var remainTimeMin = parseInt(remainWorkTimeMin % 60)
    var remainTimeStr = "남은 근무 시간 : "
    if (remainTimeHour > 0 && remainTimeMin > 0) {
        remainTimeStr = remainTimeStr + remainTimeHour + "시간 " + remainTimeMin + "분"
    } else if (remainTimeHour == 0) {
        remainTimeStr = remainTimeMin + "분"
    } else if (remainTimeMin == 0) {
        remainTimeStr = remainTimeHour + "시간"
    }

    var remainAvgTotalMin = remainWorkTimeMin / remainWorkDay
    var remainAvgTimeHour = parseInt(remainAvgTotalMin / 60)
    var remainAvgTImeMin = parseInt(remainAvgTotalMin % 60)

    var infoData = "남은 근무 일수 : " + remainWorkDay + ", " + remainTimeStr + ", 평균 추천 근무시간 : " + remainAvgTimeHour + "시간 " + remainAvgTImeMin + "분";
    title.innerText = "근태 현황 ( " + infoData + " )"; 

    console.log("남은 근무 일수 : " + remainWorkDay + ", " + remainTimeStr + ", 평균 추천 근무시간 : " + remainAvgTimeHour + "시간 " + remainAvgTImeMin + "분");
}

function CheckLoadedHrPageNeedElements(hrPage) {
    if (hrPage == null) {
        return false;
    }

    var title = hrPage.getElementById('divMenu');
    if (title == null) {
        return false;
    }

    var workTimeElements = hrPage.getElementsByClassName("tx-15 work-hours-color report-event-value")
    if (workTimeElements == null || workTimeElements.length == 0) {
        return false;
    }

    var dayOffElements = hrPage.getElementsByClassName("tx-15 day-off-color report-event-value")
    if (dayOffElements == null || dayOffElements.length == 0) {
        return false;
    }

    var timeElements = hrPage.getElementsByClassName("text-center tx-semibold tx-20 ")
    if (timeElements == null || timeElements.length == 0) {
        return false;
    }

    return true;
}

function TryCalcWorkTime() {
    var id = setInterval(function () {

        var title = document.getElementById('divMenu');
        var hrPageElement = document.getElementById("nhrIframe");
        if (title != null) {
            if (CheckLoadedHrPageNeedElements(document)) {
                CalcWorkTime();
                clearInterval(id);
            }
        } else if (hrPageElement != null) {
            var hrPage = hrPageElement.contentDocument;
            if (hrPage != null) {
                if (CheckLoadedHrPageNeedElements(hrPage)) {
                    CalcWorkTime();
                    clearInterval(id);
                }
            }

        }
    }, 500);
}