
const isInRatingsMode = confirm("您是否进入打分模式？")

var currentDisplayedListData = [
  {
    name: "waiting",
  },
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function retrieveAndApplyData() {
  console.log("Retriving Data");
  var httpobj = new XMLHttpRequest();
  httpobj.onload = () => {
    var resText = httpobj.responseText;
    console.info(`Received Information, length is ${resText.length}`);
    if (resText != JSON.stringify(currentDisplayedListData)) {
      currentDisplayedListData = JSON.parse(resText);
      if(!isInRatingsMode){
        shuffleArray(currentDisplayedListData)
      }
      renderList();
    } else {
      console.log("Same!");
    }
  };
  httpobj.onabort = () => {
    alert("连接因不明原因被终止。");
    console.error("Connection Aborted");
  };
  httpobj.onerror = () => {
    alert("连接出错。");
    console.error("Connection Failed");
  };
  httpobj.ontimeout = () => {
    alert("网络不佳，连接超时，无法获取数据。");
    console.error("Network Timeout");
  };
  httpobj.open("GET", "displaydata.json");
  httpobj.send();
}
function renderList() {
  var cardContainer = document.querySelector(".card-container");
  cardContainer.innerHTML = "";
  currentDisplayedListData.forEach((item,index) => {
    let newElement = document.createElement("div");
    newElement.onclick = () => {
      openTargetedFrame(item.url);
    };
    newElement.classList.add("card");
    newElement.setAttribute("role", "button");
    newElement.setAttribute("tabindex", "0");
    newElement.innerHTML = `<img src="${item.img}" alt="">
        <span class="imglabel" title="代码行数">
            <span class="main">${(isInRatingsMode?("["+(index+1)+"] "):"")}${item.name}</span>
            <span class="loc">${item.loc || "不明"}</span>
        </span>`;
    cardContainer.appendChild(newElement);
  });
}

var isFrameActivated = false;

function toggleWebModal() {
  document.querySelector(".webframe").classList.toggle("hidden");
}
function toggleFrameWidth(setWidth) {
  if (setWidth != -1) {
    document.querySelector(".actual-frame").style.width = setWidth + "px";
    if (setWidth > window.innerWidth) {
      alert("你设置了比窗口更宽的宽度，可能无法正常反映网页状态。");
    }
  } else {
    document.querySelector(".actual-frame").attributes.removeNamedItem("style");
  }
}

function openRandomWebsite() {
  openTargetedFrame(
    currentDisplayedListData[
      Math.round(Math.random() * 1000) % currentDisplayedListData.length
    ].url
  );
}
function openCurrentFrameSrc() {
  document.querySelector("iframe").classList.add("expand");
  setTimeout(() => {
    window.open(document.querySelector("iframe").src, "_blank", "");
    document.querySelector("iframe").classList.remove("expand");
  }, 200);
}
function openTargetedFrame(url, noFullscreen = false) {
  isFrameActivated = true;
  document.querySelector("iframe").src = url;
  toggleWebModal();
  if (noFullscreen == false) {
    if(document.documentElement.requestFullscreen){
      document.querySelector(".webframe").requestFullscreen();
    }else{
      document.querySelector(".webframe").webkitRequestFullScreen();
    }
  }
}
document.querySelector("#random").onclick = (e) => {
  openRandomWebsite();
};

retrieveAndApplyData();
// setInterval(function(){
//     document.querySelector(".addr").innerText = document.querySelector('iframe').src;
//     console.log(document.querySelector('iframe').src)
// }, 500)

function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime) return;
  }
}

document.querySelector(".close-btn").onclick = () => {
  toggleWebModal();
  isFrameActivated = false;
  if(document.exitFullscreen){
    document.exitFullscreen();
  }else{
    document.webkitCancelFullscreen();
  }
  document.querySelector("iframe").src = "./assets/nothing.html";
};

var rightElement = document.querySelector(".right");

function gamepadProcessLoop() {
  let buttonIsActivated = false;
  var gamepads = navigator.getGamepads
    ? navigator.getGamepads()
    : navigator.webkitGetGamepads
    ? navigator.webkitGetGamepads
    : [];
  if (!gamepads) {
    return;
  }
  mainpad = gamepads[0];
  let str0 = "";
  mainpad.buttons.forEach((item, index) => {
    if (item.pressed) {
      str0 += index;
      str0 += " ";
    }
  });
//   console.log(str0.length > 0 ? str0 : "");
// console.log(document.querySelector('html').scrollTop)
  if (mainpad.buttons[0].pressed) {
    document.activeElement.click();
    buttonIsActivated = true;
  }
  if (mainpad.buttons[1].pressed && isFrameActivated) {
    document.querySelector(".close-btn").onclick();
    buttonIsActivated = true;
  }
  if (mainpad.buttons[2].pressed && isFrameActivated) {
    document.querySelector(".external").onclick();
    buttonIsActivated = true;
  }
  if (mainpad.buttons[3].pressed && !isFrameActivated) {
    document.querySelector("#random").click();
    buttonIsActivated = true;
  }
  if (mainpad.buttons[9].pressed && !isFrameActivated) {
    document.querySelector(".left").classList.toggle("collapse");
    buttonIsActivated = true;
  }
  if (!isFrameActivated) {
    
    if (mainpad.buttons[15].pressed) {
      // document.activeElement.nextElementSibling.focus();
      // buttonIsActivated = true;
    }
    if (mainpad.buttons[12].pressed){
        document.querySelector("#subit").click();buttonIsActivated = true;
        buttonIsActivated = true;
    }
    if (mainpad.buttons[13].pressed){
        document.querySelector("#about").click();buttonIsActivated = true;buttonIsActivated = true;
    }
  }
  //   detectAndChangeFocusInList(mainpad)
  if(isFrameActivated){
    let frame = document.querySelector('iframe')
    try {
      if(frame.contentDocument){
        frame.contentDocument.documentElement.scrollTop =
          ((Math.abs(mainpad.axes[3]) > 0.1) ? ((mainpad.axes[3]) ** 3)*25 : 0) +
          frame.contentDocument.documentElement.scrollTop;
      }else{
        console.info("iframeScrollFunctionBlocked")
      }
        // console.log(frame.contentDocument.documentElement.scrollTop)
    } catch (error) {
      console.error("iframeScrollFunctionError")
    }
    
  }else{
    if (window.innerWidth <= 930) {
        // console.log(document.querySelector('html').scrollTop)
      document.querySelector('html').scrollTop =
        ((Math.abs(mainpad.axes[3]) > 0.1) ? ((mainpad.axes[3]) ** 3)*25 : 0) +
        document.querySelector('html').scrollTop;
    } else {
        // console.log(rightElement.scrollTop)
      rightElement.scrollTop =
        ((Math.abs(mainpad.axes[3]) > 0.1) ? ((mainpad.axes[3] ** 3)*25) : 0) +
        rightElement.scrollTop;
        
    }
  }
  
  if(buttonIsActivated){
    setTimeout(() => {
        requestAnimationFrame(gamepadProcessLoop);
    }, 100);
  }else{
      next = requestAnimationFrame(gamepadProcessLoop);
  }
}

addEventListener("gamepadconnected", () => {
  gamepadProcessLoop();
  document.documentElement.classList.add("gamepad");
//   document.querySelector(".padmouse").style.top =
//     document.querySelector(".padmouse").clientTop;
//   document.querySelector(".padmouse").style.left =
//     document.querySelector(".padmouse").clientLeft;
});

addEventListener("gamepaddisconnected", ()=>{
  document.documentElement.classList.remove("gamepad");
})

// currentDisplayedListData
function exportCurrentListAsID(){
  var outStr = "";
  currentDisplayedListData.forEach((item,index)=>{
    outStr += `[${index+1}] ${item.name}\n`
  })
  console.log(outStr)
}