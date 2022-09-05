const toggle = document.getElementById("toggle-switch");

const info = {
  type: "basic",
  iconUrl: "../images/icon128.png",
  title: "Info",
  message: "You must reload the current page for changes to apply!",
  buttons: [{ title: "Dont Show Again" }],
};

toggle.addEventListener("change", function () {
  chrome.storage.sync.get(["state"], function (data) {
    var state = data.state;

    if (state == false) {
      state = true;
    } else if (state == true) {
      state = false;
    }

    chrome.storage.sync.set({ state: state });

    chrome.notifications.create("notification", info);
  });
});

function startUp() {
  chrome.storage.sync.get("state", function (data) {
    toggle.checked = data.state;
  });
}

startUp();
