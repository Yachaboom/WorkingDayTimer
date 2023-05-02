

main();

function convertMinToTimeText(min) {
    const hours = Math.floor(min / 60);
    const minute = Math.round(min % 60);
    if (hours <= 0) {
        text = minute + "분";
    } else if (minute <= 0) {
        text = hours + "시간";
    } else {
        text = hours + "시간 " + minute + "분";
    }

    return text;
}

function addMinutesToTime(timeString, minutesToAdd) {
    // Parse the input time string to extract hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number);

    // Convert hours and minutes to total minutes
    const totalMinutes = hours * 60 + minutes;

    // Add the input minutes to the total minutes
    const updatedTotalMinutes = totalMinutes + minutesToAdd;

    // Convert the updated total minutes back to hours and minutes
    const updatedHours = Math.floor(updatedTotalMinutes / 60) % 24;
    const updatedMinutes = Math.round(updatedTotalMinutes % 60);

    // Format the result as a time string in the 'H:M' format with 2-digit minutes
    const formattedTime = `${updatedHours}:${updatedMinutes.toString().padStart(2, '0')}`;

    return formattedTime;
}

function onClickTest(event) {
    console.log("onCkickTest" + event.target.textContent);
}

function onClickCome(event) {
    console.log("onClickCome" + event.target.textContent);
    location.reload(true);
}

function onClickLeave(event) {
    console.log("onClickLeave" + event.target.textContent);
    location.reload(true);
}

function isWorkingDay(date) {
    
    const holidays = [
        // 고정 공휴일(양력 기준)
        new Date(date.getFullYear(), 0, 1), // 새해 첫날
        new Date(date.getFullYear(), 2, 1), // 31절
        new Date(date.getFullYear(), 4, 1), // 노동절
        new Date(date.getFullYear(), 4, 5), // 어린이날
        new Date(date.getFullYear(), 5, 6), // 현충일
        new Date(date.getFullYear(), 7, 15), // 광복절
        new Date(date.getFullYear(), 9, 3), // 개천절
        new Date(date.getFullYear(), 9, 9), // 한글날
        new Date(date.getFullYear(), 11, 25), // Christmas Day

        // 2023년 한정(음력및 대체)
        new Date(date.getFullYear(), 0, 21), // 설날(D-1)
        new Date(date.getFullYear(), 0, 22), // 설날
        new Date(date.getFullYear(), 0, 23), // 설날(D+1)
        new Date(date.getFullYear(), 0, 24), // 설 대체공휴일
        new Date(date.getFullYear(), 4, 27), // 부처님 오신날
        new Date(date.getFullYear(), 4, 29), // 석가탄신일 대체공휴일
        new Date(date.getFullYear(), 8, 28), // 추석(D-1)
        new Date(date.getFullYear(), 8, 29), // 추석
        new Date(date.getFullYear(), 8, 30), // 추석(D+1)
    ];

    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 is Sunday, 6 is Saturday
        // Check if the current day is a holiday
        if (!holidays.some(holiday => holiday.getDate() === date.getDate() && holiday.getMonth() === date.getMonth())) {
            return true;
        }
    }

    return false;
}

function isWorkingDayCell(cell) {
    const year = cell.getAttribute('year');
    const month = cell.getAttribute('month') - 1;
    const day = cell.getAttribute('day');

    const cellDay = new Date(year, month, day);

    return isWorkingDay(cellDay);
}

function displayTimer(celanderDoc, totalWorkRequest, totalWorkMinute, totalVacationMinute, remainWorkMinute, remainWorkingDay, futureHalfDay) {
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

    // 출퇴근 버튼 이벤트 구독
    var testButton = workPlanDoc.getElementById("otBtn");
    if (testButton) {
        testButton.addEventListener("click", onClickTest);
    }    

    var comeButton = workPlanDoc.getElementById("comeBtn");
    if (comeButton) {
        comeButton.addEventListener("click", onClickCome);
    }   

    var leaveButton = workPlanDoc.getElementById("leaveBtn");
    if (leaveButton) {
        leaveButton.addEventListener("click", onClickLeave);
    }    

    // 의미없는 출퇴근 예상 시간 텍스트 지우고 추천 퇴근 시간 및 추천 근무 시간 넣어주기
    var oldInfoSpan = workPlanDoc.getElementById("ftStartTm");
    if (oldInfoSpan) {
        var oldInfoRoot = oldInfoSpan.parentElement;
        while (oldInfoRoot && oldInfoRoot.firstChild) {
            oldInfoRoot.removeChild(oldInfoRoot.firstChild);
        }

        // 추천 근무 시간 계산
        var recommedDayTimeText;
        const remainWorkTime = Math.max(remainWorkMinute, 0);
        const remainWorkDay = Math.max(remainWorkingDay, 0);

        if (remainWorkTime == 0 || remainWorkDay == 0) {
            recommedDayTimeText = "근무 시간 소진";
        }
        else {
            const recommendDayTime = remainWorkTime / remainWorkDay;
            recommedDayTimeText = convertMinToTimeText(recommendDayTime);

            const enterTime = workPlanDoc.getElementById("comeTm").innerText;
            const exitTime = workPlanDoc.getElementById("leaveTm").innerText;

            if (enterTime != "출근" && exitTime == "퇴근") {
                // 출근 상태
                const recommendExitTime = addMinutesToTime(enterTime, recommendDayTime + 60);
                recommedDayTimeText = recommedDayTimeText + "(" + recommendExitTime + ")";
            }

            recommedDayTimeText = "추천근무: " + recommedDayTimeText;
        }

        //<span id="ftStartTm" style="font-weight: bold">10:58</span>
        if (oldInfoRoot) {
            const recommendDiv = workPlanDoc.createElement("div");
            recommendDiv.style.fontWeight = "bold";
            recommendDiv.style.fontFamily = "Dotum";
            recommendDiv.style.fontSize = 11;
            recommendDiv.style.color = "#202040";
            recommendDiv.textContent = recommedDayTimeText;

            oldInfoRoot.appendChild(recommendDiv);
        }
    }

    // 의미 없는 보상 표시 지워주고 정비데이 정보로 보여 주기
    var rewardSpan = workPlanDoc.getElementById("remainRwdVacCnt");
    if (rewardSpan) {
        var rewardRoot = rewardSpan.parentElement;
        if (rewardRoot) {
            rewardRoot.childNodes[2].textContent = rewardRoot.childNodes[2].textContent.replace("보상", "정비");

            const etcVacationCount = getEtcVacationCount(celanderDoc);
            const remainEtcVacation = 0.5 - 0.5 * etcVacationCount;
            rewardRoot.childNodes[3].textContent = remainEtcVacation + "일";
        }

    }

    // 기존 소정 근로 프로그레스 바 수정
    // 남은 근무 시간으로 
    var workTimer = workPlanDoc.getElementsByClassName("progress-bar")[0];
    if (workTimer) {
        workTimer.style = "width:180px;background-color: #6a6a6a;"
        workTimer.title = "남은 근무 시간";
        var workTimerOverlay = workTimer.querySelector("div");
        if (workTimerOverlay) {
            const workPercentage = ((totalWorkMinute + totalVacationMinute) / totalWorkRequest) * 100;
            workTimerOverlay.style = "width:" + workPercentage + "%;background-color: #2C061F;";

            var workTimerText = workTimerOverlay.querySelector("#ftTm");
            if (workTimerText) {
                // 남은근무:X시간 Y분
                var text;
                if (remainWorkMinute <= 0) {
                    text = "근무시간 모두소진";
                } else {
                    text = convertMinToTimeText(remainWorkMinute);
                }

                workTimerText.innerText = text + " / " + remainWorkingDay + "일";
            }
        }
    }

    // 넘친 시간 혹은 모자르는 시간 표기
    // 넘친 시간 계산 - 남은 근무일 동안 8시간, 미래 반차일 경우 4시간 근무한다고 가정하고 현재 기준으로 여유 시간
    // 모자르는 시간 계산 - 남은 근무일 동안 8시간, 미래 반차일 경우 4시간 근무한다고 가정하고 현재 기준으로 부족 시간

    const remainDayExceptFutureHalf = Math.max(remainWorkingDay - futureHalfDay, 0);
    const remainDayExpectMin = remainDayExceptFutureHalf * 60 * 8 + futureHalfDay * 60 * 4;

    var remainTimer = workPlanDoc.getElementsByClassName("progress-bar")[1];
    if (remainTimer) {
        while (remainTimer.firstChild) {
            remainTimer.removeChild(remainTimer.firstChild);
        }

        const newDiv = workPlanDoc.createElement("div");
        newDiv.style.width = "100%"
        //newDiv.textContent = "여유시간: X시 Y분";       

        const newSpan = workPlanDoc.createElement("span");
        const diffMin = Math.abs(remainWorkMinute - remainDayExpectMin);
        if (remainWorkMinute > remainDayExpectMin) {
            newDiv.style.backgroundColor = "#E21818";
            newSpan.innerText = "부족시간: "+convertMinToTimeText(diffMin);
            newSpan.style.color = "#98DFD6";
        }
        else {
            newDiv.style.backgroundColor = "#00235B";
            newSpan.innerText = "여유시간: "+convertMinToTimeText(diffMin);
            newSpan.style.color = "#FFDD83";
        }
        

        newDiv.appendChild(newSpan);

        remainTimer.appendChild(newDiv);

    }
}

function calcWorkTime(data) {
    const parser = new DOMParser();
    const dataDoc = parser.parseFromString(data, "text/html");

    const totalWorkRequest = getWorkingDaysInCurrentMonth() * 8 * 60;
    const totalWorkMinute = getTotalWorkingMinuteInCurrentMonth(dataDoc);
    const totalVacationMinute = getTotalVacationMinuteInCurrentMonth(dataDoc);
    const remainWorkMinute = totalWorkRequest - totalVacationMinute - totalWorkMinute;
    const remainWorkingDay = getRemainWorkingday(dataDoc);
    const futureHalfDay = getFutureHalfVacation(dataDoc);

    console.log('totalWorkRequest %d', totalWorkRequest);
    console.log('totalWorkMinute %d', totalWorkMinute);
    console.log('totalVacationMinute %d', totalVacationMinute);
    console.log('remainWorkMinute %d', remainWorkMinute);
    console.log('remainWorkingDay %d', remainWorkingDay);
    console.log('futureHalfDay %d', futureHalfDay);

    displayTimer(dataDoc, totalWorkRequest, totalWorkMinute, totalVacationMinute, remainWorkMinute, remainWorkingDay, futureHalfDay)
}

function getWorkingDaysInCurrentMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    let workingDays = 0;

    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
        if (isWorkingDay(day)) {
            workingDays++;
        }
    }

    return workingDays;
}

function IsThisMonthCell(cell) {
    const month = cell.getAttribute('month');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;

    return month == currentMonth;
}

function getCellDayCompare(cell) {
    const year = cell.getAttribute('year');
    const month = cell.getAttribute('month') - 1;
    const day = cell.getAttribute('day');

    const cellDay = new Date(year, month, day);
    const today = new Date();

    cellDay.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (cellDay < today) {
        return "past";
    }
    else if (cellDay > today) {
        return "future";
    }
    else {
        return "today";
    }
}

function getCellVacationType(cell) {
    const dayData = cell.innerText;

    if (dayData.includes("연차")) {
        return "allday";
    }
    else if (dayData.includes("경조")) {
        return "allday";
    }
    else if (dayData.includes("대체")) {
        return "allday";
    }
    else if (dayData.includes("예비군")) {
        return "allday";
    }
    else if (dayData.includes("출산")) {
        return "allday";
    }
    else if (dayData.includes("오전") && dayData.includes("오후")) {
        return "allday";
    }
    else if (dayData.includes("오전") || dayData.includes("오후")) {
        return "halfday";
    }

    return "none";
}

function isEtcVacationHasCell(cell) {
    const dayData = cell.innerText;

    if (dayData.includes("기타")) {
        return true;
    }

    return false;
}

function getHalfVacationType(cell) {
    const vacationType = getCellVacationType(cell);
    if (vacationType == "halfday") {
        const dayData = cell.innerText;
        if (dayData.includes("오전")) {
            return "am";
        } else if (dayData.includes("오후")) {
            return "pm";
        }
    }

    return "none";
}

function getCellVacationTypeFromData(dayData) {
    if (dayData.includes("연차")) {
        return "allday";
    }
    else if (dayData.includes("경조")) {
        return "allday";
    }
    else if (dayData.includes("대체")) {
        return "allday";
    }
    else if (dayData.includes("예비군")) {
        return "allday";
    }
    else if (dayData.includes("출산")) {
        return "allday";
    }
    else if (dayData.includes("오전") && dayData.includes("오후")) {
        return "allday";
    }
    else if (dayData.includes("오전") || dayData.includes("오후")) {
        return "halfday";
    }

    return "none";
}

function getDayTimeFromData(data) {

    // 전일연차시 근무시간 없음
    const vacationType = getCellVacationTypeFromData(data);
    if (vacationType == "allday") {
        return 0;
    }

    // 미

    const regex = /\[근로\]\s+([\d: ]+~[\d: ]+)/;
    const match = data.match(regex);
    if (match) {
        const timeRange = match[1];
        const [startTime, endTime] = timeRange.split(' ~ ');
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        const durationMinutes = endMinutes - startMinutes;

        if (isNaN(durationMinutes)) {
            return 0;
        }

        // 휴게시간 계산
        var breakTimeMin = 60;
        if (vacationType == "halfday") {

            if (startHour == 13 && endHour == 13) {
                breakTimeMin = 60;
            }
            else if (startHour < 13 && endHour >= 14) {
                breakTimeMin = 60;
            }
            else if (startHour == 13) {
                breakTimeMin = 60 - startMinute;
            }
            else if (endHour == 13) {
                breakTimeMin = endMinute;
            }
        }

        return Math.max(durationMinutes - breakTimeMin, 0);
    } else {
        return 0;
    }
}



function getDayVacationMinFromData(data) {
    // 전일연차시 근무시간 없음
    const vacationType = getCellVacationTypeFromData(data);
    if (vacationType == "allday") {
        return 8 * 60;
    }
    else if (vacationType == "halfday") {
        return 4 * 60;
    }

    return 0;
}

function getRemainDay(data) {
    const vacationType = getCellVacationTypeFromData(data);
    if (vacationType == "allday") {
        return 0;
    }

    const regex = /\[근로\]\s+([\d: ]+~[\d: ]+)/;
    const match = data.match(regex);
    if (match) {
        const timeRange = match[1];
        if (timeRange.length == 0) {
            return 0;
        }
        const [startTime, endTime] = timeRange.split(' ~ ');
        if (endTime.length == 0) {
            return 1;
        }

        return 0;
    } else {
        return 1;
    }
}

function getTotalWorkingMinuteInCurrentMonth(calendarDoc) {
    const calendarTable = calendarDoc.querySelector(".calender");
    var totalMinute = 0;
    for (let i = 1; i < calendarTable.rows.length; ++i) {
        const row = calendarTable.rows[i];
        for (let j = 0; j < 5; ++j) {
            const cell = row.cells[j];
            if (IsThisMonthCell(cell) == false) {
                continue;
            }
            const dayData = cell.innerText;
            const dayWorkMinute = getDayTimeFromData(dayData);
            totalMinute = totalMinute + dayWorkMinute;
        }
    }

    return totalMinute;
}

function getTotalVacationMinuteInCurrentMonth(calendarDoc) {
    const calendarTable = calendarDoc.querySelector(".calender");
    var totalMinute = 0;
    for (let i = 1; i < calendarTable.rows.length; ++i) {
        const row = calendarTable.rows[i];
        for (let j = 0; j < 5; ++j) {
            const cell = row.cells[j];
            if (IsThisMonthCell(cell) == false) {
                continue;
            }
            const dayData = cell.innerText;
            const dayVacationMin = getDayVacationMinFromData(dayData);
            totalMinute = totalMinute + dayVacationMin;
        }
    }

    return totalMinute;
}

function getRemainWorkingday(calendarDoc) {
    const calendarTable = calendarDoc.querySelector(".calender");
    var totalRemainDay = 0;
    for (let i = 1; i < calendarTable.rows.length; ++i) {
        const row = calendarTable.rows[i];
        for (let j = 0; j < 5; ++j) {
            const cell = row.cells[j];
            if (IsThisMonthCell(cell) == false) {
                continue;
            }

            if (getCellDayCompare(cell) == "past") {
                continue;
            }

            if (isWorkingDayCell(cell) == false) {
                continue;
            }

            const dayData = cell.innerText;
            const remainDay = getRemainDay(dayData);
            totalRemainDay = totalRemainDay + remainDay;
        }
    }

    return totalRemainDay;
}

function getFutureHalfVacation(calendarDoc) {
    const calendarTable = calendarDoc.querySelector(".calender");
    var totalFutureHalfVacation = 0;

    for (let i = 1; i < calendarTable.rows.length; ++i) {
        const row = calendarTable.rows[i];
        for (let j = 0; j < 5; ++j) {
            const cell = row.cells[j];
            const compare = getCellDayCompare(cell);
            if (compare == "past") {
                continue;
            }

            const vacationType = getCellVacationType(cell);
            if (vacationType == "halfday") {
                totalFutureHalfVacation = totalFutureHalfVacation + 1;
            }
        }
    }

    return totalFutureHalfVacation;
}

function getTodayCell(calendarDoc) {
    const calendarTable = calendarDoc.querySelector(".calender");
    var todayCell = null;

    for (let i = 1; i < calendarTable.rows.length; ++i) {
        const row = calendarTable.rows[i];
        for (let j = 0; j < 5; ++j) {
            const cell = row.cells[j];
            const compare = getCellDayCompare(cell);
            if (compare == "today") {
                todayCell = cell;
                break;
            }
        }
    }

    return todayCell;
}

function getEtcVacationCount(calendarDoc) {
    const calendarTable = calendarDoc.querySelector(".calender");
    var etcCount = 0;

    for (let i = 1; i < calendarTable.rows.length; ++i) {
        const row = calendarTable.rows[i];
        for (let j = 0; j < 5; ++j) {
            const cell = row.cells[j];
            if (IsThisMonthCell(cell) == false) {
                continue;
            }

            if (isEtcVacationHasCell(cell)) {
                etcCount = etcCount + 1;
            }
        }
    }

    return etcCount;
}

function main() {
    chrome.storage.local.get(['workdata'], (result) => {
        calcWorkTime(result.workdata);
    });

    //const totalWorkMinute = await getTotalWorkingMinuteInCurrentMonth();
    //console.log("totalWorkingMinute is %d", totalWorkMinute);
}


