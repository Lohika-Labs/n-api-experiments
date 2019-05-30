const path = require('path')
const fs = require('fs')
const cv = require('opencv.js')
const jpeg = require('jpeg-js')

const addon = require('./build/Release/module.node')

console.time('opencv to B&W')
addon.toGrayScale(path.join(__dirname, 'baboon.jpg'), path.join(__dirname, 'baboon-bw-n-api.jpg'))
console.timeEnd('opencv to B&W')


console.time('opencv.js to B&W')

const inJpgDataBW = fs.readFileSync(path.join(__dirname, 'baboon.jpg'))
const rawDataBW = jpeg.decode(inJpgDataBW)
const img = cv.matFromImageData(rawDataBW)
const bwImg = new cv.Mat()

cv.cvtColor(img, bwImg, cv.COLOR_RGBA2GRAY)
cv.cvtColor(bwImg, bwImg, cv.COLOR_GRAY2RGBA)

const outData = {
  data: bwImg.data,
  width: bwImg.size().width,
  height: bwImg.size().height,
}

const outJpegData = jpeg.encode(outData, 95)

fs.writeFileSync(path.join(__dirname, 'baboon-bw-opencv-js.jpg'), outJpegData.data )
console.timeEnd('opencv.js to B&W')

const x = 256
const y = 256

console.time('opencv resize')
addon.resize(path.join(__dirname, 'baboon.jpg'), path.join(__dirname, 'baboon-resize-n-api.jpg'), x, y)
console.timeEnd('opencv resize')

console.time('opencv.js resize')
const inJpegDataResize = fs.readFileSync(path.join(__dirname, 'baboon.jpg'))
const rawDataResize = jpeg.decode(inJpegDataResize)

const imgResize = cv.matFromImageData(rawDataResize)

const resizedImg = new cv.Mat()
const newSize = new cv.Size(x, y)
cv.resize(imgResize, resizedImg, newSize)

const outDataResize = {
  data: resizedImg.data,
  width: resizedImg.size().width,
  height: resizedImg.size().height,
}
const outJpegDataResize = jpeg.encode(outDataResize, 100)

fs.writeFileSync(path.join(__dirname, 'baboon-resize-opencv-js.jpg'), outJpegDataResize.data)
console.timeEnd('opencv.js resize')
