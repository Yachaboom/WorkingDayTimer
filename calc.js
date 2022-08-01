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
    var regex = /[^0-9]/g;
    var workTimeInfo = workTime.split(' ');

    var curWorkTimeMin = Number("0");
    if (workTimeInfo.length == 1) {
        curWorkTimeMin = Number(workTimeInfo[0].replace(regex, ""));
    }
    else if (workTimeInfo.length == 2) {
        curWorkTimeMin = Number(workTimeInfo[0].replace(regex, "")) * 60 + Number(workTimeInfo[1].replace(regex, ""));
    }

    var today = new Date();
    var totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    var curMonthHoliday = 0;
    var curMonth = today.getMonth() + 1;
    console.log("Current Month is " + curMonth);
    if (curMonth == 8) {
        curMonthHoliday = 1;
    }
    else if (curMonth == 9) {
        curMonthHoliday = 2;
    }
    else if (curMonth == 10) {
        curMonthHoliday = 2;
    }
    else if (curMonth == 11) {
        curMonthHoliday = 0;
    }
    else if (curMonth == 12) {
        curMonthHoliday = 0;
    }

    var dayOffInfo = hrPage.getElementsByClassName("tx-15 day-off-color report-event-value");
    var dayOffNum = Number(dayOffInfo[0].innerText.replace(regex, "")) + Number(dayOffInfo[1].innerText.replace(regex, "")) + Number(dayOffInfo[2].innerText.replace(regex, "")) + curMonthHoliday;
    var totalWorkingDay = totalDays - dayOffNum
    var workStatusInfo = hrPage.getElementsByClassName("text-center tx-semibold tx-20 ");
    var workOutCount = Number(workStatusInfo[3].innerText.replace(regex, ""));
    var remainWorkDay = totalWorkingDay - workOutCount;
    var totalWorkTimeMin = totalWorkingDay * 8 * 60
    var remainWorkTimeMin = totalWorkTimeMin - curWorkTimeMin

    if (remainWorkDay <= 0 || remainWorkTimeMin <= 0) {
        title.innerText = "근태 현황 ( 필수 근무시간을 모두 소진했습니다 )"
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

    var InTimeInfo = hrPage.getElementsByClassName("check-in-status tx-20 tx-bold text-center");
    if (InTimeInfo.length <= 0) {
        return;
    }
    var InTimeElement = InTimeInfo[0];

    var OutTimeInfo = hrPage.getElementsByClassName("check-out-status tx-20 tx-bold text-center");
    if (OutTimeInfo.length <= 0) {
        return;
    }
    var OutTimeElement = OutTimeInfo[0];

    if (InTimeElement.innerText != "-" && OutTimeElement.innerText == "-") {
        var InTimeDetailInfo = InTimeElement.innerText.split(":");
        var curTimeTotalMin = Number(InTimeDetailInfo[0]) * 60 + Number(InTimeDetailInfo[1]);
        var recommendOutTimeTotalMin = curTimeTotalMin + remainAvgTotalMin;
        var recommendOutTimeHour = parseInt(recommendOutTimeTotalMin / 60) + 1 /* 휴게시간 */;
        var recommendOutTimeMin = parseInt(recommendOutTimeTotalMin % 60);

        var timeInfoText = hrPage.getElementsByClassName("text-opacity tx-12  text-center text-uppercase")[1];
        timeInfoText.innerText = "추천 퇴근 시간 : " + recommendOutTimeHour + "시 " + recommendOutTimeMin + "분";
    }
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