const toggle = document.getElementById("toggle-switch");
const newTitle = document.getElementById("new-title");
const update = document.getElementById("update");

const info = {
  type: "basic",
  iconUrl: "../images/icon128.png",
  title: "Info",
  message: "You must reload the current page for changes to apply!",
  buttons: [{ title: "Dont Show Again" }],
};

update.addEventListener("click", function () {
  chrome.storage.sync.set({ newTitle: newTitle.value });
  newTitle.value = "";
});

toggle.addEventListener("change", function () {
  chrome.storage.sync.get(["stateCCB"], function (data) {
    var stateCCB = data.stateCCB;

    if (stateCCB == false || stateCCB == null) {
      stateCCB = true;
    } else if (stateCCB == true) {
      stateCCB = false;
    }

    chrome.storage.sync.set({ stateCCB: stateCCB });

    chrome.storage.sync.get("showNotificationCCB", function (data) {
      if (data.showNotificationCCB != false) {
        chrome.notifications.create(info);
        chrome.notifications.onButtonClicked.addListener(notAgain);
      }
    });
  });
});

function notAgain() {
  var show = false;
  chrome.storage.sync.set({ showNotificationCCB: show });
}

function startUp() {
  chrome.storage.sync.get(["stateCCB"], function (data) {
      toggle.checked = data.stateCCB;
  });
}

startUp();
