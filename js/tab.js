const tabName = document.getElementById("tab-name");

function setBackground(url) {
  const backgroundEl = document.querySelector(".background");
  backgroundEl.style.backgroundImage = `url('${url}')`;
}

function onFileSelect(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      localStorage.backgroundData = reader.result;
      setBackground(localStorage.backgroundData);
    } catch (err) {
      alert("Image size must be smaller than 5MB");
    }
  });
  reader.readAsDataURL(file);
}

function listenPick() {
  const picker = document.querySelector(".picker");
  picker.addEventListener("change", (e) => {
    onFileSelect(e);
  });
}

function init() {
  listenPick();
  if (localStorage.backgroundData) {
    setBackground(localStorage.backgroundData);
  } else {
    setBackground("../images/default.png");
  }
}

chrome.storage.sync.get(["stateCCB", "newTitle", "firstCCB"], function (data) {
  var newTabTitle = data.newTitle;

  if (!data.stateCCB && data.firstCCB == true) {
    document.getElementById("label").style.display = "none";
  }

  if (newTabTitle == "" || newTabTitle == null) {
    newTabTitle = "New Tab";
  } else {
    newTabTitle = String(newTabTitle);
  }

  tabName.innerHTML = newTabTitle;
});

init();
