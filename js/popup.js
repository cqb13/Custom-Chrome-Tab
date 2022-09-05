const toggle = document.getElementById("toggle-switch");

const info = {
  type: "basic",
  iconUrl: "../images/icon128.png",
  title: "Info",
  message: "You must reload the current page for changes to apply!",
  buttons: [{ title: "Dont Show Again" }],
};

toggle.addEventListener("change", function () {
  chrome.storage.sync.get(["state", "showIcon"], function (data) {
    var state = data.state;
    var showIcon = data.showIcon;
    if (state == false) {
      state = true;
    } else {
      state = false;
    }
    chrome.storage.sync.set({ state: state });
    chrome.storage.sync.set({ showIcon: showIcon });
    if (showIcon != false) {
      chrome.notifications.create(info);
      chrome.notifications.onButtonClicked.addListener(notAgain(showIcon));
    }
  });
});

function notAgain(showIcon) {
  showIcon = false;
  chrome.storage.sync.set({ showIcon: showIcon });
}

function startUp() {
  chrome.storage.sync.get("state", function (data) {
    toggle.checked = !data.state;
  });
}

startUp();
