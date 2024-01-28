let srclist = []
let srcimg = document.getElementById("logo")
let parr = null
let filename = document.getElementById("filename")
let display = document.getElementById("display")
let cardset = document.getElementById("cardset")
let def = document.getElementById("def")
//选择封面
function select(){
    let ipt = document.createElement("input")
    ipt.type = "file"
    ipt.accept = "image/*"
    ipt.onchange = () => {
        let src = URL.createObjectURL(ipt.files[0])
        let img = new Image()
        img.src = src
        srcimg.src = src
        def.innerHTML = "自定义封面"
        img.onload = () => {
            URL.revokeObjectURL(src)
            let cvs = document.createElement("canvas")
            let ctx = cvs.getContext("2d")
            let w = img.width
            let h = img.height
            if (w * h > 100000) {
                let scale = Math.sqrt(w * h / 100000)
                w = Math.round(w / scale)
                h = Math.round(h / scale)
            }
            cvs.width = w
            cvs.height = h
            ctx.drawImage(img, 0, 0, w, h)
            parr = dataURLtoArray(cvs.toDataURL())
        }
    }
    ipt.click()
}
function emptyAll(){
    clearImg()
    clear()
}
function clearImg(){
    def.innerHTML = "默认封面"
    srcimg.src = "logo.png"
}
//清空
function clear() {
    filename.innerHTML = "无文件"
    var l = cardset.childNodes.length;
    for(var i = 0;i < l;i++) cardset.removeChild(cardset.childNodes[0]);
    srclist.map(x => URL.revokeObjectURL(x))
    srclist = []
}
//创建展示
function createdisplay(b) {
    let src = URL.createObjectURL(b)
    srclist.push(b)
    let div = document.createElement("div")
    div.style.paddingTop = "2.5rem"
    let div2 = document.createElement("div")
    div2.style.wordBreak = "break-all"
    div.appendChild(div2)
	div.align = "center"
    if (b.type.indexOf("image") > -1) {
        let img = document.createElement("img")
        img.style.maxWidth = "100%"
        img.src = src
        div.appendChild(img)
        return div
    }
    if (b.type.indexOf("video") > -1) {
        let img = document.createElement("video")
        img.controls = true
        img.style.maxWidth = "100%"
        img.src = src
        div.appendChild(img)
        return div
    }
	if (b.type.indexOf("pdf") > -1 || b.type.indexOf("doc") > -1){
		let fram = document.createElement("iframe")
		fram.width = "800"
		fram.height = "600"
		fram.src = src
		div.appendChild(fram)
		return div
	}
    return null
}
//新卡片
function newcard(node){
    var li = document.createElement("li")
    var liattr = document.createAttribute("class")
    liattr.value = "pos-card"
    li.setAttributeNode(liattr)
    var div = document.createElement("div")
    var divattr = document.createAttribute("class")
    divattr.value = "content"
    div.setAttributeNode(divattr)
    var title = document.createElement("div")
    title.innerHTML = node.name
    var btn = document.createElement("a")
    var btnattr = document.createAttribute("class")
    btnattr.value = "refer"
    btn.setAttributeNode(btnattr)
    btn.href = URL.createObjectURL(node)
    btn.download = node.name
    btn.innerHTML = "下载"
    div.appendChild(title)
    div.appendChild(btn)
    var pic = createdisplay(node)
    if(pic != null) div.appendChild(pic);
    li.appendChild(div)
    cardset.appendChild(li)
}
function genpngarr(big) {
    if (def.innerHTML == "默认封面") {
        if (big) return randompngarr2();
        else return randompngarr();
    }
    else return parr;
}
function packAll(){
    clear()
    let ipt = document.createElement("input")
    ipt.type = "file"
    ipt.multiple = true
    ipt.onchange = () => {
        let j = ipt.files.length
        let finish = []
        Array.from(ipt.files).map((f, x) => {
            wrap(f, code, r => {
                finish[x] = r
                if (--j == 0) {
                    let src = URL.createObjectURL(assembletoblob(genpngarr(true), finish))
                    srclist.push(src)
                    filename.innerHTML = f.name
                    srcimg.src = src
                }
            })
        })
    }
    ipt.click()
}
function packFile(){
    clear()
    let ipt = document.createElement("input")
    ipt.type = "file"
    ipt.multiple = true
    ipt.onchange = () => {
        Array.from(ipt.files).map(f => {
            wrap(f, code, r => {
                let src = URL.createObjectURL(assembletoblob(genpngarr(false), [r]))
                srclist.push(src)
                filename.innerHTML = f.name
                srcimg.src = src
            })
        })
    }
    ipt.click()
}
function extractFile(){
    clearImg()
    clear()
    let ipt = document.createElement("input")
    ipt.type = "file"
    ipt.accept = "image/*"
    ipt.multiple = true
    ipt.onchange = () => {
        Array.from(ipt.files).map(f => {
            decode(f, code, r => {
                if (r) {
                    let count = 0
                    r.map(x => {
                        newcard(x)
                        count++
                    })
                    filename.innerHTML = f.name
                    srcimg.src = window.URL.createObjectURL(f)
                    alert("提取" + count + "个文件成功")
                }
                else alert("提取文件失败,请使用原图");
            })
        })
    }
    ipt.click()
}