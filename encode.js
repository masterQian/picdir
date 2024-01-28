let code = getint32(stringtoarray("tpWj"))
let codeinput = document.getElementById("ident")
codeinput.onchange = () => {
    code = getint32(stringtoarray(code.value))
}
function extract(arr, code) {
    if (getint32(arr, 0) != (0x89504e47 | 0)) return false;
    code = code | 0
    let i = 8
    let result = []
    while (i < arr.length - 12) {
        let length = getint32(arr, i)
        if (getint32(arr, i + 4) == code) {
            result.push(arr.slice(i + 8, i + 8 + length))
        }
        i += length + 12
    }
    return result
}
function unwraptofile(arr) {
    let i = 0
    while (arr[i] != 0) i++;
    let meta = JSON.parse(arraytostring(arr.slice(0, i)))
    return new File([arr.slice(i + 1).buffer], utf8Decode(meta.name), {
        type: meta.mime
    })
}
function decode(file, code, returnfunc) {
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = e => {
        let extracted = extract(new Uint8Array(e.target.result), code)
        if (!(extracted && extracted.length > 0)) {
            returnfunc(false)
            return
        }
        let result = []
        extracted.map(x => {
            try {
                result.push(unwraptofile(x))
            } catch (e) {}
        })
        if (result.length > 0) returnfunc(result);
        else returnfunc(false);
    }
}
function wrap(file, code, returnfunc) {
    let reader = new FileReader(file)
    reader.readAsArrayBuffer(file)
    reader.onload = e => {
        let arr = new Uint8Array(e.target.result)
        let meta = stringtoarray(JSON.stringify({
            name: utf8Encode(file.name),
            mime: file.type
        }), true)
        let ident = createint32(code)
        let lengtharr = createint32(meta.length + arr.length)
        let crcarr = createint32(crc32arr([ident, meta, arr]))
        let result = concatuint8array([lengtharr, ident, meta, arr, crcarr])
        returnfunc(result)
    }
}
function assembletoblob(pngarr, filearr) {
    let l = pngarr.length
    let arr = concatuint8array([pngarr.slice(0, l - 12)].concat(filearr).concat([pngarr.slice(l - 12)]))
    return new Blob([arr.buffer], {
        type: "image/png"
    })
}
function randompngarr2() {
    let cvs = document.createElement("canvas")
    let ctx = cvs.getContext("2d")
    cvs.width = cvs.height = 400
    ctx.fillStyle = "rgba(255, 255, 255, 0)"
    ctx.fillRect(0, 0, 400, 400)
    ctx.setTransform(1, 0, 0, 1, 50, 50)
    let theta = Math.random() * 2 * Math.PI;
    ctx.fillStyle = "rgb(" + [Math.cos(theta), Math.cos(theta - Math.PI * 2 / 3), Math.cos(theta + Math.PI * 2 / 3)].map(
        x => x * (Math.random() + 1) * 64 + 96 + Math.random() * 64) + ")"
    ctx.shadowColor = "#0000003f"
    ctx.shadowOffsetX = 10
    ctx.shadowOffsetY = 10
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(150, 150, 175, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
    ctx.shadowColor = "#00000000"
    ctx.fillStyle = ctx.strokeStyle = "#fff"
    ctx.lineJoin = "round"
    ctx.lineWidth = 16
    ctx.beginPath()
    ctx.moveTo(110, 50)
    ctx.lineTo(225, 50)
    ctx.lineTo(225, 250)
    ctx.lineTo(75, 250)
    ctx.lineTo(75, 85)
    ctx.closePath()
    ctx.stroke()
    ctx.fillRect(105, 110, 90, 16)
    ctx.fillRect(105, 155, 90, 16)
    ctx.fillRect(105, 200, 90, 16)
    return dataURLtoArray(cvs.toDataURL("image/png"))
}
function randompngarr() {
    let cvs = document.createElement("canvas")
    cvs.width = cvs.height = 300
    let ctx = cvs.getContext("2d")
    let theta = Math.random() * 2 * Math.PI
    ctx.fillStyle = "rgb(" + [Math.cos(theta), Math.cos(theta - Math.PI * 2 / 3), Math.cos(theta + Math.PI * 2 / 3)].map(
        x => x * (Math.random() + 1) * 64 + 96 + Math.random() * 64) + ")"
    ctx.fillRect(0, 0, 300, 300)
    ctx.fillStyle = ctx.strokeStyle = "#fff"
    ctx.lineJoin = "round"
    ctx.lineWidth = 16
    ctx.beginPath()
    ctx.moveTo(110, 50)
    ctx.lineTo(225, 50)
    ctx.lineTo(225, 250)
    ctx.lineTo(75, 250)
    ctx.lineTo(75, 85)
    ctx.closePath()
    ctx.stroke()
    ctx.fillRect(105, 110, 90, 16)
    ctx.fillRect(105, 155, 90, 16)
    ctx.fillRect(105, 200, 90, 16)
    return dataURLtoArray(cvs.toDataURL("image/png"))
}