const backgroundColorPickerCircle = document.getElementById("background-color-circle");
const backgroundColorPickerBlock = document.getElementById("background-color-block");
const backgroundPicker = document.querySelector(".picker-background");
const blockBackgroundGradient = document.getElementById("gradient");
const blockBackgroundGradient1 = document.getElementById("gradient1");
const blockBackgroundGradient2 = document.getElementById("gradient2");
const gradientSwitch = document.getElementById("gradient-switch");
const circleColorPicker = document.getElementById("circle-color");
const blockColorPicker = document.getElementById("block-color");
const blockBackgroundNormal = document.getElementById("normal");
const iconPicker = document.querySelector(".picker-icon");
const modeSwitch = document.getElementById("mode-switch");
const circleMode = document.getElementById("circle-mode");
const blockMode = document.getElementById("block-mode");
const modeLabel = document.getElementById("mode-label");
const imageMode = document.getElementById("image-mode");
const newTitle = document.getElementById("new-title");
const update = document.getElementById("update");

update.addEventListener("click", function() {
  chrome.storage.sync.set({ newTitle: newTitle.value });
  newTitle.value = "";
  reload();
});

iconPicker.addEventListener("change", e => {
  onFileSelect(e, "icon");
});

backgroundPicker.addEventListener("change", e => {
  onFileSelect(e, "background");
});

modeSwitch.addEventListener("change", function() {
  showType(modeSwitch.value, true);
});

gradientSwitch.addEventListener("change", function() {
  if (gradientSwitch.checked) {
    blockBackgroundNormal.style.display = "none";
    blockBackgroundGradient.style.display = "block";
    chrome.storage.sync.set({ gradientCCT: true });
  } else {
    blockBackgroundNormal.style.display = "block";
    blockBackgroundGradient.style.display = "none";
    chrome.storage.sync.set({ gradientCCT: false });
  }
  reload();
});

const setColors = () => {
  chrome.storage.sync.get(
    ["backgroundColorCCT", "backgroundColorBlockCCT", "circleColorCCT", "blockColorCCT", "gradient1CCT", "gradient2CCT"],
    function(data) {
      backgroundColorPickerCircle.value = data.backgroundColorCCT;
      circleColorPicker.value = data.circleColorCCT;
      blockColorPicker.value = data.blockColorCCT;
      blockBackgroundGradient1.value = data.gradient1CCT;
      blockBackgroundGradient2.value = data.gradient2CCT;
      backgroundColorPickerBlock.value = data.backgroundColorBlockCCT;
    }
  );
};

const switchBackgroundType = (mode, reloads) => {
  chrome.storage.sync.set({ backgroundTypeCCT: mode });
  if (reloads) {
    reload();
  }
};

backgroundColorPickerCircle.addEventListener("change", function() {
  chrome.storage.sync.set({ backgroundColorCCT: backgroundColorPickerCircle.value });
  reload();
});

backgroundColorPickerBlock.addEventListener("change", function() {
  chrome.storage.sync.set({ backgroundColorBlockCCT: backgroundColorPickerBlock.value });
  reload();
});

circleColorPicker.addEventListener("change", function() {
  chrome.storage.sync.set({ circleColorCCT: circleColorPicker.value });
  reload();
});

blockBackgroundGradient1.addEventListener("change", function() {
  chrome.storage.sync.set({ gradient1CCT: blockBackgroundGradient1.value });
  reload();
});

blockBackgroundGradient2.addEventListener("change", function() {
  chrome.storage.sync.set({ gradient2CCT: blockBackgroundGradient2.value });
  reload();
});

blockColorPicker.addEventListener("change", function() {
  chrome.storage.sync.set({ blockColorCCT: blockColorPicker.value });
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
    blockMode.style.display = "none";
    switchBackgroundType("C", reloads);
    setColors();
  } else if (mode == 1) {
    modeLabel.innerHTML = "Image Mode";
    circleMode.style.display = "none";
    imageMode.style.display = "block";
    blockMode.style.display = "none";
    switchBackgroundType("I", reloads);
  } else if (mode == 2) {
    modeLabel.innerHTML = "Block Mode";
    circleMode.style.display = "none";
    imageMode.style.display = "none";
    blockMode.style.display = "block";
    switchBackgroundType("B", reloads);
  }
  setColors();
}

function startUp() {
  chrome.storage.sync.get(["firstCCT", "backgroundTypeCCT", "gradientCCT"], function(data) {
    if (data.backgroundTypeCCT == "C") {
      modeSwitch.value = 0;
      showType(0, false);
    } else if (data.backgroundTypeCCT == "I") {
      modeSwitch.value = 1;
      showType(1, true);
    } else if (data.backgroundTypeCCT == "B") {
      modeSwitch.value = 2;
      showType(2, false);
    } else {
      modeSwitch.value = 1;
      showType(1, true);
    }

    if (data.gradientCCT == true) {
      gradientSwitch.checked = true;
      blockBackgroundNormal.style.display = "none";
      blockBackgroundGradient.style.display = "block";
    } else {
      gradientSwitch.checked = false;
      blockBackgroundNormal.style.display = "block";
      blockBackgroundGradient.style.display = "none";
    }

    if (data.firstCCT != true) {
      var run = true;
      chrome.storage.sync.set({ firstCCT: run });
      chrome.storage.sync.set({ backgroundColorCCT: "#444444" });
      chrome.storage.sync.set({ backgroundColorBlockCCT: "#6992c9" });
      chrome.storage.sync.set({ circleColorCCT: "#496bbe" });
      chrome.storage.sync.set({ blockColorCCT: "#496bbe" });
      chrome.storage.sync.set({ gradient1CCT: "#f9f9f9" });
      chrome.storage.sync.set({ gradient2CCT: "#6992c9" });
      chrome.storage.sync.set({ gradientCCT: false });
    }
  });
}

function reload() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0].url === "chrome://newtab/") {
      chrome.tabs.reload();
    }
  });
}

startUp();
