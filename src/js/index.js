import '../scss/index.scss'

// 德卡斯特里奥算法
// u ∈ [0, 1]
function deCasteljau(points, u) {
  // copy p0 ~ pn
  let len = points.length
  let ret = []
  for (let i = 0; i < len; i++) {
    ret.push({ x: points[i].x, y: points[i].y })
  }

  let p = { x: null, y: null }
  let n = points.length - 1

  for (let col = 1; col <= n; col++) {
    for (let i = 0; i <= n - col; i++) {
      ret[i].x = (1 - u) * ret[i].x + u * ret[i + 1].x
      ret[i].y = (1 - u) * ret[i].y + u * ret[i + 1].y
    }
  }

  return ret[0]
}

// 画切线
function drawTangentLines(points, u) {
  let pij = {}
  let pjk = {}
  let pointsLen = points.length

  for (let i = 0; i <= pointsLen - 3; i++) {
    pij.x = (1 - u) * points[i].x + u * points[i+1].x
    pij.y = (1 - u) * points[i].y + u * points[i+1].y
    pjk.x = (1 - u) * points[i+1].x + u * points[i+2].x
    pjk.y = (1 - u) * points[i+1].y + u * points[i+2].y
    context.beginPath()
    context.moveTo(pij.x, pij.y)
    context.lineTo(pjk.x, pjk.y)
    context.stroke()
  }
}

let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
context.lineWidth = 1.0
context.strokeStyle = 'black'

let offScreenCanvas = document.createElement('canvas')
let offScreenContext = offScreenCanvas.getContext('2d')
context.lineWidth = 1.0
context.strokeStyle = 'black'

let points = []

function drawPointsLines() {
  let len = points.length
  let point

  for (let i = 0; i < len; i++) {
    point = points[i]
    context.beginPath()
    context.arc(point.x, point.y, 3, 0, 2 * Math.PI)
    context.stroke()

    if (i < len - 1) {
      context.beginPath()
      context.moveTo(point.x, point.y)
      context.lineTo(points[i + 1]['x'], points[i + 1]['y'])
      context.stroke()
    }
  }
}

const frame = 60
// 5s
const duration = 5
let u = 0
let reqId

// 简单动画
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  //
  u += 1 / frame / duration
  
  drawBezierLine(points, u)
  drawPointsLines()
  drawTangentLines(points, u)
  
  if (u < 1) {
    reqId = requestAnimationFrame(draw)
  } else {
    cancelAnimationFrame(reqId)
  }
}

let lastPoint
function drawBezierLine(points, u) {
  offScreenContext.beginPath()
  offScreenContext.moveTo(lastPoint.x, lastPoint.y)
  // 更新lastPoint
  lastPoint = deCasteljau(points, u)
  offScreenContext.lineTo(lastPoint.x, lastPoint.y)
  offScreenContext.stroke()


  context.drawImage(offScreenCanvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
}

points.push({ x: 100, y: 100 })
points.push({ x: 180, y: 60 })
points.push({ x: 250, y: 100 })
points.push({ x: 300, y: 20 })
lastPoint = points[0]
draw()