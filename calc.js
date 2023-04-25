

main();


function displayTimer(totalWorkRequest, totalWorkMinute, totalVacationMinute, remainWorkMinute, remainWorkingDay)
{
    const iframes = document.getElementsByTagName("iframe");
    var workPlanDoc = null;
    for(let i = 0 ; i < iframes.length ; ++i)
    {
        if (iframes[i].src == "https://gwa.oneunivrs.com/yjmgames/portlet/ftPortletForm")
        {
            workPlanDoc = iframes[i].contentDocument;
        }
    }

    if (workPlanDoc == null)
    {
        console.log("test1");
        return;
    }

    //var progresses = document.getElementsByClassName("progress-bar");
    var workTimer = workPlanDoc.getElementsByClassName("progress-bar")[0];
    if (workTimer)
    {
        workTimer.style = "width:180px;background-color: #252526;"
    }

    
    
    //var workTimerProgress = workTimer.querySelector("div");
    //workTimerProgress.style = "background-color: rgb(30, 30, 30); width: 40%";
}

function calcWorkTime(data) {
    const parser = new DOMParser();
    const dataDoc = parser.parseFromString(data, "text/html");
    
    const totalWorkRequest = getWorkingDaysInCurrentMonth() * 8 * 60;
    const totalWorkMinute = getTotalWorkingMinuteInCurrentMonth(dataDoc);
    const totalVacationMinute = getTotalVacationMinuteInCurrentMonth(dataDoc);
    const remainWorkMinute = totalWorkRequest - totalVacationMinute - totalWorkMinute;
    const remainWorkingDay = getRemainWorkingday(dataDoc);
    
    
    console.log('totalWorkRequest %d', totalWorkRequest);
    console.log('totalWorkMinute %d', totalWorkMinute);
    console.log('totalVacationMinute %d', totalVacationMinute);
    console.log('remainWorkMinute %d', remainWorkMinute);
    console.log('remainWorkingDay %d', remainWorkingDay);

    displayTimer(totalWorkRequest, totalWorkMinute, totalVacationMinute, remainWorkMinute, remainWorkingDay)
    
}

function getWorkingDaysInCurrentMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const holidays = [
        // 고정 공휴일(양력 기준)
        new Date(currentYear, 0, 1), // 새해 첫날
        new Date(currentYear, 2, 1), // 31절
        new Date(currentYear, 4, 1), // 노동절
        new Date(currentYear, 4, 5), // 어린이날
        new Date(currentYear, 5, 6), // 현충일
        new Date(currentYear, 7, 15), // 광복절
        new Date(currentYear, 9, 3), // 개천절
        new Date(currentYear, 9, 9), // 한글날
        new Date(currentYear, 11, 25), // Christmas Day

        // 2023년 한정(음력및 대체)
        new Date(currentYear, 0, 21), // 설날(D-1)
        new Date(currentYear, 0, 22), // 설날
        new Date(currentYear, 0, 23), // 설날(D+1)
        new Date(currentYear, 0, 24), // 설 대체공휴일
        new Date(currentYear, 4, 27), // 부처님 오신날
        new Date(currentYear, 4, 29), // 석가탄신일 대체공휴일
        new Date(currentYear, 8, 28), // 추석(D-1)
        new Date(currentYear, 8, 29), // 추석
        new Date(currentYear, 8, 30), // 추석(D+1)
    ];

    let workingDays = 0;

    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
        const dayOfWeek = day.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 is Sunday, 6 is Saturday
            // Check if the current day is a holiday
            if (!holidays.some(holiday => holiday.getDate() === day.getDate() && holiday.getMonth() === day.getMonth())) {
                workingDays++;
            }
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

function getDayTimeFromData(data) {

    // 전일연차시 근무시간 없음
    if (data.includes("연차")) {
        return 0;
    }

    if (data.includes("오전") && data.includes("오후")) {
        return 0;
    }

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
        if (data.includes("오전") || data.includes("오후")) {

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
    if (data.includes("연차")) {
        return 8 * 60;
    }

    if (data.includes("오전") && data.includes("오후")) {
        return 8 * 60;
    }

    if (data.includes("오전") || data.includes("오후")) {
        return 4 * 60;
    }

    return 0;
}

function getRemainDay(data) {
    if (data.includes("연차")) {
        return 0;
    }

    if (data.includes("오전") && data.includes("오후")) {
        return 0;
    }

    const regex = /\[근로\]\s+([\d: ]+~[\d: ]+)/;
    const match = data.match(regex);
    if (match) {
        const timeRange = match[1];
        if (timeRange.length == 0)
        {
            return 0;
        }
        const [startTime, endTime] = timeRange.split(' ~ ');
        if (endTime.length == 0)
        {
            if (data.includes("오전") || data.includes("오후")) {
                return 0.5;
            }

            return 1;
        }
        
        return 0;
    } else {

        if (data.includes("오전") || data.includes("오후")) {
            return 0.5;
        }

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
            const dayData = cell.innerText;
            const remainDay = getRemainDay(dayData);
            totalRemainDay = totalRemainDay + remainDay;
        }
    }

    return totalRemainDay;
}

function main() {
    chrome.storage.local.get(['workdata'], (result) => {
        calcWorkTime(result.workdata);
    });

    //const totalWorkMinute = await getTotalWorkingMinuteInCurrentMonth();
    //console.log("totalWorkingMinute is %d", totalWorkMinute);
}


