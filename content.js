// console.log("This is content.js");

let timeoutId = [];

// Send request functionality which fetches all connect elements and send request at a 5sec interval.
function sendRequests() {
  const allConnects = document.querySelectorAll('button[aria-label~="Invite"]');
  let message = {
    connectLength: allConnects.length,
  };
  chrome.runtime.sendMessage(message, function (response) {
    console.log(response.status);
  });

  allConnects.forEach((item, i) => {
    let newId = setTimeout(() => {
      item.click();
      setTimeout(() => {
        const element = document.querySelector('button[aria-label~="Send"]');
        element.click();

        // sending message to popup to increment the circular progress bar
        chrome.runtime
          .sendMessage({
            inviteSent: true,
          })
          .then((response) => {
            console.log(response.status);
          })
          .catch(() => clearAllIntervals());
      }, 500);
    }, 5000 * (i + 1));
    timeoutId.push(newId);
  });
}

// To clear all the intervals (Stop connecting functionality)
function clearAllIntervals() {
  console.log("We reached clearIntervals");
  timeoutId.forEach((item) => {
    clearTimeout(item);
  });
}

// function which executes when we receive the message
function gotMessage(req, sender, res) {
  if (req.sendRequest) {
    sendRequests();
  } else {
    clearAllIntervals();
  }
}

// Fetches the message from popup.js to check if we need to send requests or stop them
chrome.runtime.onMessage.addListener(gotMessage);
