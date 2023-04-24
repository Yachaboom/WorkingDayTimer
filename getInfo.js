
console.log("Content script is running");

async function fetchAndParseHTML(url) {
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(text, "text/html");
  
    // Extract the information you need from the htmlDocument
    const data = htmlDocument.querySelector('.left_div').textContent;
    //console.log(data)

    // Send the extracted data to the background script
    chrome.runtime.sendMessage({
      action: "yachaboom",
      data: "Test"
    });
  }

fetchAndParseHTML("https://gwa.oneunivrs.com/yjmgames/ft/ftCalendarForm");