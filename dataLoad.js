function waitForCondition(conditionFunc, interval = 500, timeout = 5000) {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
        const checkCondition = () => {
            if (conditionFunc()) {
                resolve();
            } else if (Date.now() - startTime > timeout) {
                reject(new Error('Timeout waiting for condition'));
            } else {
                setTimeout(checkCondition, interval);
            }
        };

        checkCondition();
    });
}

window.addEventListener('load', () => {
    if (window.location.href == "https://gwa.oneunivrs.com/yjmgames/ft/ftCalendarForm") {
        const tableLoaded = () => {
            const table = document.querySelector(".calender");
            if (table == null) {
                return false;
            }

            const tableBody = table.querySelector("tbody");
            if (tableBody == null) {
                return false;
            }

            if (table.rows.length < 4) {
                return false;
            }

            return tableBody.childElementCount > 3;
        };

        waitForCondition(tableLoaded)
            .then(() => {
                const pageContent = document.documentElement.outerHTML;
                chrome.runtime.sendMessage({
                    message: 'page_loaded',
                    content: pageContent
                });
            })
            .catch((error) => {
                console.error('Failed to wait for the condition:', error);
            });
    }
});

//https://gwa.oneunivrs.com/gw/cmm/systemx/myInfoManage.do
window.addEventListener('load', () => {
    if (window.location.href == "https://gwa.oneunivrs.com/gw/cmm/systemx/myInfoManage.do") {
        console.log("info test");

        //document.querySelector("table").rows[2].cells[2].innerText
        //document.querySelector("table").rows[6].cells[1].innerText

        const tableLoaded = () => {
            const table = document.querySelector("table");
            if (table == null) {
                return false;
            }

            if (table.rows.length < 7) {
                return false;
            }

            const nameRow = table.rows[2];
            if (nameRow.cells.length < 3) {
                return false;
            }

            const teamRow = table.rows[6];
            if (teamRow.cells.length < 2) {
                return false;
            }

            return true;
        };

        waitForCondition(tableLoaded)
            .then(() => {
                const name = document.querySelector("table").rows[2].cells[2].innerText;
                const team = document.querySelector("table").rows[6].cells[1].innerText
                chrome.runtime.sendMessage({
                    message: 'info_loaded',
                    content: {name, team}
                });
            })
            .catch((error) => {
                console.error('Failed to wait for the condition:', error);
            });
    }
})