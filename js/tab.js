const container = document.getElementsByTagName("body")[0];
const background = document.querySelector(".background");
const head = document.getElementsByTagName("head")[0];
const tabName = document.getElementById("tab-name");
const circlesList = [];
let color = ""

function setBackground(url) {
  background.style.backgroundImage = `url('${url}')`;
}

function setIcon(icon) {
  head.insertAdjacentHTML(
    "afterbegin",
    `
      <link rel="icon" href="${icon}" />
    `
  );
}

const circles = async () => {
  await chrome.storage.sync.get(["backgroundColorCCT", "circleColorCCT"], function (data) {
    document.body.style.backgroundColor = data.backgroundColorCCT;
    startCircleCreation(data.circleColorCCT);
  });
};

const startCircleCreation = (color) => {
  const mainWidth = container.offsetWidth;
  const mainHeight = container.offsetHeight;
  const maxSize = Math.floor(Math.random() * 500);

  const x = Math.floor(Math.random() * mainWidth);
  const y = Math.floor(Math.random() * mainHeight);

  //stop creating circles inside other circles
  for (let i = 0; i < circlesList.length; i++) {
    if (
      x > circlesList[i].offsetLeft &&
      x < circlesList[i].offsetLeft + circlesList[i].offsetWidth &&
      y > circlesList[i].offsetTop &&
      y < circlesList[i].offsetTop + circlesList[i].offsetHeight
    ) {
      circles()
      return;
    }
  }

  const circle = document.createElement("div");
  circle.classList.add("circle");
  circle.style.border = `2px solid ${color}`;
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  circlesList.push(circle);

  grow(circle, mainHeight, mainWidth, maxSize);
};

async function grow(circle, mainHeight, mainWidth, maxSize) {
  let currentSize = 0;

  while (currentSize < maxSize) {
    currentSize += 1;

    circle.style.width = `${currentSize}px`;
    circle.style.height = `${currentSize}px`;
    circle.style.opacity = `${currentSize / maxSize}`;

    await new Promise((resolve) => setTimeout(resolve, 3));

    if (circle.offsetLeft + circle.offsetWidth >= mainWidth) {
      break;
    }

    if (circle.offsetTop + circle.offsetHeight >= mainHeight) {
      break;
    }

    // Check if circle touches another circle's border
    for (let i = 0; i < circlesList.length; i++) {
      if (
        circle !== circlesList[i] &&
        doCirclesCollide(circle, circlesList[i])
      ) {
        circle.style.width = `${currentSize - 1}px`;
        circle.style.height = `${currentSize - 1}px`;
        circles();
        return;
      }
    }

    container.appendChild(circle);
  }
  circles();
}

// check if two circles collide
function doCirclesCollide(c1, c2) {
  const distance = getDistance(c1, c2);
  const minDistance = c1.offsetWidth / 2 + c2.offsetWidth / 2;
  return distance < minDistance;
}

// get distance between two circles
function getDistance(c1, c2) {
  const x1 = c1.offsetLeft + c1.offsetWidth / 2;
  const y1 = c1.offsetTop + c1.offsetHeight / 2;
  const x2 = c2.offsetLeft + c2.offsetWidth / 2;
  const y2 = c2.offsetTop + c2.offsetHeight / 2;
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

const blocks = async () => {
  await chrome.storage.sync.get(["backgroundColorBlockCCT", "blockColorCCT", "gradientCCT", "gradient1CCT", "gradient2CCT"], function (data) {
    if (data.gradientCCT) {
      document.body.style.background = `linear-gradient(180deg, ${data.gradient1CCT}, ${data.gradient2CCT})`;
    } else {
      document.body.style.backgroundColor = data.backgroundColorBlockCCT;
    }
    createBlocks(data.blockColorCCT);
  });
}

const createBlocks = (color) => {
  let blockAmount = Math.floor(Math.random() * 10) + 1;

  background.style.background = `rgb(255, 255, 255, 0.1)`;
  background.style.backdropFilter = `blur(1px)`;
  background.style.webkitBackdropFilter = `blur(1px)`;

  for (let i = 0; i < blockAmount; i++) {
    createBlock(color);
  }
}

const createBlock = (color) => {
  let block = document.createElement("div");
  block.classList.add("block");
  block.style.height = Math.floor(Math.random() * 20) + 10 + "%";
  block.style.width = Math.floor(Math.random() * 20) + 10 + "%";
  block.style.transform = "rotate(" + Math.floor(Math.random() * 180) + "deg)";
  block.style.left = Math.floor(Math.random() * 80) + "%";
  block.style.top = Math.floor(Math.random() * 80) + "%";
  block.style.opacity = Math.random();
  block.style.backgroundColor = color;
  container.appendChild(block);
}

//!!!: on first load, background is blank until popup is opened
const init = async () => {
  let backgroundType = await chrome.storage.sync.get(["backgroundTypeCCT"]);
  let tabTitle = await chrome.storage.sync.get(["newTitle"]);

  let mode = backgroundType.backgroundTypeCCT;
  let title = tabTitle.newTitle;

  if (title == "" || title == null) {
    tabName.innerHTML = "New Tab"
  } else {
    tabName.innerHTML = title
  }

  // Image mode is default
  if (mode == "C") {
    circles();
  } else if (mode == "B") {
    blocks();
  } else {
    if (localStorage.backgroundData) {
      setBackground(localStorage.backgroundData);
    } else {
      setBackground("../images/default.png");
    }
  }

  if (localStorage.iconData) {
    setIcon(localStorage.iconData);
  } else {
    setIcon("../images/icon128.png");
  }
};

init();
