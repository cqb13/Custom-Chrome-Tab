const toggle = document.getElementById("toggle-switch");
const newTitle = document.getElementById("new-title");
const update = document.getElementById("update");

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

    reload();

    chrome.storage.sync.set({ stateCCT: stateCCT });
  });
});

function startUp() {
  chrome.storage.sync.get(["stateCCT", "firstCCT"], function (data) {
    if (data.firstCCT != true) {
      var run = true;
      toggle.checked = run;
      chrome.storage.sync.set({ firstCCT: run });
    } else {
      toggle.checked = data.stateCCT;
    }
  });
}

function reload() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
}

startUp();
