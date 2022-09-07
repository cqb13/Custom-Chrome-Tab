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
  chrome.storage.sync.get(["stateCCT"], function (data) {
    var stateCCT = data.stateCCT;

    if (stateCCT == false) {
      stateCCT = true;
    } else {
      stateCCT = false;
    }

    chrome.storage.sync.set({ stateCCT: stateCCT });

    chrome.storage.sync.get("showNotificationCCT", function (data) {
      if (data.showNotificationCCT != false) {
        chrome.notifications.create(info);
        chrome.notifications.onButtonClicked.addListener(notAgain);
      }
    });
  });
});

function notAgain() {
  var show = false;
  chrome.storage.sync.set({ showNotificationCCT: show });
}

function startUp() {
  chrome.storage.sync.get(["stateCCT", "firstCCT"], function (data) {
      if (data.firstCCT != true) {
        var run = true
        toggle.checked = run
        chrome.storage.sync.set({ firstCCT: run })
      } else {
        toggle.checked = data.stateCCT;
      }
  });
}

startUp();
