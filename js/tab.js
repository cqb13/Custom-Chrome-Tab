const head = document.getElementsByTagName("head")[0];
const tabName = document.getElementById("tab-name");

function setBackground(url) {
  const backgroundEl = document.querySelector(".background");
  backgroundEl.style.backgroundImage = `url('${url}')`;
}

function setIcon(icon) {
  head.insertAdjacentHTML(
    "afterbegin",
    `
      <link rel="icon" href="${icon}" />
    `
  );
}

function onFileSelect(e, type) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    if (type === "background") {
      try {
        localStorage.backgroundData = reader.result;
        setBackground(localStorage.backgroundData);
      } catch (err) {
        alert("Image size must be smaller than 5MB");
      }
    } else {
      try {
        localStorage.iconData = reader.result;
        setIcon(localStorage.iconData);
      } catch (err) {
        alert("Image size must be smaller than 5MB");
      }
    }
  });
  reader.readAsDataURL(file);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
}

function listenPick() {
  const backgroundPicker = document.querySelector(".picker-background");
  const iconPicker = document.querySelector(".picker-icon");
  backgroundPicker.addEventListener("change", (e) => {
    onFileSelect(e, "background");
  });

  iconPicker.addEventListener("change", (e) => {
    onFileSelect(e, "icon");
  });
}

function init() {
  if (localStorage.backgroundData) {
    setBackground(localStorage.backgroundData);
  } else {
    setBackground("../images/default.png");
  }
  if (localStorage.iconData) {
    setIcon(localStorage.iconData);
  } else {
    setIcon("../images/icon128.png");
  }
}

chrome.storage.sync.get(["stateCCT", "newTitle", "firstCCT"], function (data) {
  var newTabTitle = data.newTitle;

  if (!data.stateCCT && data.firstCCT == true) {
    document.getElementById("display").style.display = "none";
  }

  if (newTabTitle == "" || newTabTitle == null) {
    newTabTitle = "New Tab";
  } else {
    newTabTitle = String(newTabTitle);
  }

  tabName.innerHTML = newTabTitle;
});

listenPick();
init();
