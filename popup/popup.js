// Fetches the connect-btn which checks if user has chose to connect or not

let connectBtn = document.querySelector("#connect-btn");

// Function which changes the styling for button by toggling stop-connect class
const handleClassToggle = () => {
  connectBtn.classList.toggle("stop-connect");
  if (!connectBtn.classList.contains("stop-connect")) {
    connectBtn.innerHTML = "START CONNECTING";
  } else {
    connectBtn.innerHTML = "STOP CONNECTING";
  }
};

// Sending message to current tab's content script to start sending the requests
function checkConnection() {
  handleClassToggle();
  let params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, gotTabs);
}

function gotTabs(tabs) {
  let message = {
    sendRequest: connectBtn.classList.contains("stop-connect") ? true : false,
  };
  chrome.tabs.sendMessage(tabs[0].id, message);
}

connectBtn.addEventListener("click", checkConnection);

// Circular bar functionality
let progressBar = document.querySelector(".circular-progress");
let valueContainer = document.querySelector(".value-container");

let progressValue = 0;
let progressEndValue = 0;
let oneAngle = 0;
let speed = 100;

function incrementVal(req, sender, res) {
  console.log(req);
  if (req.connectLength) {
    progressEndValue = req.connectLength;
    oneAngle = 360 / progressEndValue;
  }
  if (req.inviteSent) {
    console.log("progressEndValue", progressEndValue);
    progressValue++;
    valueContainer.textContent = `${progressValue}`;
    progressBar.style.background = `conic-gradient(
    #3aa984 ${oneAngle * progressValue}deg,
    #eee ${oneAngle * progressValue}deg
    )`;
  }
  res({ status: "Response from background script" });
}

chrome.runtime.onMessage.addListener(incrementVal);
