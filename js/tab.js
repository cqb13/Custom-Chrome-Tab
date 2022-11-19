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

init();
