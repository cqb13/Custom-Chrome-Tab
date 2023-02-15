const backgroundPicker = document.querySelector(".picker-background");
const backgroundColorPicker = document.getElementById("background-color");
const circleColorPicker = document.getElementById("circle-color");
const iconPicker = document.querySelector(".picker-icon");
const modeSwitch = document.getElementById("mode-switch");
const circleMode = document.getElementById("circle-mode");
const modeLabel = document.getElementById("mode-label");
const imageMode = document.getElementById("image-mode");
const newTitle = document.getElementById("new-title");
const update = document.getElementById("update");

update.addEventListener("click", function () {
  chrome.storage.sync.set({ newTitle: newTitle.value });
  newTitle.value = "";
  reload();
});

iconPicker.addEventListener("change", (e) => {
  onFileSelect(e, "icon");
});

backgroundPicker.addEventListener("change", (e) => {
  onFileSelect(e, "background");
});

modeSwitch.addEventListener("change", function () {
  showType(modeSwitch.value, true);
});

const setColors = () => {
  chrome.storage.sync.get(
    ["backgroundColorCCT", "circleColorCCT"],
    function (data) {
      backgroundColorPicker.value = data.backgroundColorCCT;
      circleColorPicker.value = data.circleColorCCT;
    }
  );
};

const switchBackgroundType = (mode, reloads) => {
  chrome.storage.sync.set({ backgroundTypeCCT: mode });
  if (reloads) {
    reload();
  }
};

backgroundColorPicker.addEventListener("change", function () {
  chrome.storage.sync.set({ backgroundColorCCT: backgroundColorPicker.value });
  reload();
});

circleColorPicker.addEventListener("change", function () {
  chrome.storage.sync.set({ circleColorCCT: circleColorPicker.value });
  reload();
});

function onFileSelect(e, type) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      if (type === "background") {
        localStorage.backgroundData = reader.result;
        reload();
      } else {
        localStorage.iconData = reader.result;
      }
    } catch (err) {
      console.log("Image size must be smaller than 5MB");
    }
  });
  reader.readAsDataURL(file);
  reload();
}

function showType(mode, reloads) {
  if (mode == 0) {
    modeLabel.innerHTML = "Circle Mode";
    circleMode.style.display = "block";
    imageMode.style.display = "none";
    switchBackgroundType("C", reloads);
    setColors();
  } else if (mode == 1) {
    modeLabel.innerHTML = "Image Mode";
    circleMode.style.display = "none";
    imageMode.style.display = "block";
    switchBackgroundType("I", reloads);
  }
}

function startUp() {
  chrome.storage.sync.get(["firstCCT", "backgroundTypeCCT"], function (data) {
    if (data.backgroundTypeCCT == "C") {
      modeSwitch.value = 0;
      showType(0, false);
    } else if (data.backgroundTypeCCT == "I") {
      modeSwitch.value = 1;
      showType(1, true);
    } else {
      modeSwitch.value = 1;
      showType(1, true);
    }

    if (data.firstCCT != true) {
      var run = true;
      chrome.storage.sync.set({ firstCCT: run });
      chrome.storage.sync.set({ backgroundColorCCT: "#444444" });
      chrome.storage.sync.set({ circleColorCCT: "#496bbe" });
    }
  });
}

function reload() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0].url === "chrome://newtab/") {
      chrome.tabs.reload();
    }
  });
}

startUp();
