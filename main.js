var currentDisplayedListData = [
    {
        name: "waiting"
    }
]
function retrieveAndApplyData(){
    console.log("Retriving Data")
    var httpobj = new XMLHttpRequest();
    httpobj.onload = ()=>{
        var resText = httpobj.responseText
        console.info(`Received Information, length is ${resText.length}`)
        if(resText != JSON.stringify(currentDisplayedListData)){
            currentDisplayedListData = JSON.parse(resText)
            renderList()
        }else{
            console.log()
        }
    }
    httpobj.onabort = ()=>{
        alert("连接因不明原因被终止。")
        console.error("Connection Aborted")
    }
    httpobj.onerror = ()=>{
        alert("连接出错。")
        console.error("Connection Failed")
    }
    httpobj.ontimeout = ()=>{
        alert("网络不佳，连接超时，无法获取数据。")
        console.error("Network Timeout")
    }
    httpobj.open('GET', 'displaydata.json')
    httpobj.send();
}
function renderList(){
    var cardContainer = document.querySelector('.card-container')
    cardContainer.innerHTML = "";
    currentDisplayedListData.forEach((item)=>{
        let newElement = document.createElement('div')
        newElement.onclick = ()=>{
            openTargetedFrame(item.url)
        }
        newElement.classList.add('card')
        newElement.attributes['role'] = 'button'
        newElement.attributes['tabindex'] = '0'
        newElement.innerHTML = `<img src="${item.img}" alt="">
        <span class="imglabel" title="代码行数">
            <span class="main">${item.name}</span>
            <span class="loc">${item.loc||"不明"}</span>
        </span>`
        cardContainer.appendChild(newElement)
    })
}

function toggleWebModal(){
    document.querySelector('.webframe').classList.toggle('hidden');
}
function toggleFrameWidth(setWidth){
    if(setWidth != -1){
        document.querySelector('.actual-frame').style.width = setWidth + 'px';
        if(setWidth > window.innerWidth){
            alert('你设置了比窗口更宽的宽度，可能无法正常反映网页状态。')
        }
    }else{
        document.querySelector('.actual-frame').attributes.removeNamedItem('style');
    }
}

function openRandomWebsite(){
    openTargetedFrame(currentDisplayedListData[Math.round(Math.random()*1000)%currentDisplayedListData.length].url)
}
function openTargetedFrame(url){
    document.querySelector('iframe').src = url;
    toggleWebModal();
}
document.querySelector('#random').onclick = (e)=>{
    openRandomWebsite()
}

retrieveAndApplyData()
// setInterval(function(){
//     document.querySelector(".addr").innerText = document.querySelector('iframe').src;
//     console.log(document.querySelector('iframe').src)
// }, 500)

document.onkeydown = function(e) {
    if(e.key === "Enter") { // The Enter/Return key
      document.activeElement.onclick(e);
    }
  };