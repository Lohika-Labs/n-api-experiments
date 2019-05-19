const path = require('path')
const fs = require('fs')
const cv = require('opencv.js')
const jpeg = require('jpeg-js')

const addon = require('./build/Release/module.node')

const QUICK_SORT = 0
const BUBBLE_SORT = 1
const ARRAY_LENGTH = 10

const targetArray = Array(ARRAY_LENGTH)
  .fill(null)
  .map(() => Math.round(Math.random() * 1000))

const sortedArrayJSBubble = [...targetArray]

const defaultComparator = (a, b) => {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

const quickSort = ( unsortedArray, comparator = defaultComparator) => {
  const sortedArray = [ ...unsortedArray ]
  const recursiveSort = (start, end) => {
    if (end - start < 1) {
      return
    }
    const pivotValue = sortedArray[end]
    let splitIndex = start
    for (let i = start; i < end; i++) {
      const sort = comparator(sortedArray[i], pivotValue)
      if (sort === -1) {
        if (splitIndex !== i) {
          const temp = sortedArray[splitIndex]
          sortedArray[splitIndex] = sortedArray[i]
          sortedArray[i] = temp
        }
        splitIndex++
      }
    }
    sortedArray[end] = sortedArray[splitIndex]
    sortedArray[splitIndex] = pivotValue
    recursiveSort(start, splitIndex - 1)
    recursiveSort(splitIndex + 1, end)
  }
  recursiveSort(0, unsortedArray.length - 1)
  return sortedArray
}

console.time('JS quick sort')

const sortedArrayJS = quickSort(targetArray)

console.timeEnd('JS quick sort')
console.log(`sortedArrayJS length: ${sortedArrayJS.length}`)

console.time('JS bubble sort')
for (let i = 0; i < sortedArrayJSBubble.length - 1; ++i) {
  for (let j = 0; j < sortedArrayJSBubble.length - 1 - i; ++j) {
    if (sortedArrayJSBubble[j] > sortedArrayJSBubble[j + 1]) {
      const temp = sortedArrayJSBubble[j + 1]
      sortedArrayJSBubble[j + 1] = sortedArrayJSBubble[j]
      sortedArrayJSBubble[j] = temp
    }
  }
}
console.timeEnd('JS bubble sort')
console.log(`sortedArrayJSBubble length: ${sortedArrayJSBubble.length}`)

console.time('N-API bubble sort')
const sortedArrayCbubble = addon.sort(targetArray, BUBBLE_SORT)
console.timeEnd('N-API bubble sort')
console.log(`sortedArrayCbubble length: ${sortedArrayCbubble.length}`)

console.time('N-API quick sort')
const sortedArrayCquick = addon.sort(targetArray, QUICK_SORT)
console.timeEnd('N-API quick sort')
console.log(`sortedArrayCquick length: ${sortedArrayCquick.length}`)

console.time('opencv to B&W')
addon.toGrayScale(path.join(__dirname, 'baboon.jpg'), path.join(__dirname, 'baboon-bw-n-api.jpg'))
console.timeEnd('opencv to B&W')


console.time('opencv.js to B&W')

const inJpgDataBW = fs.readFileSync(path.join(__dirname, 'baboon.jpg'))
const rawDataBW = jpeg.decode(inJpgDataBW)
const img = cv.matFromImageData(rawDataBW)
const bwImg = new cv.Mat()

cv.cvtColor(img, bwImg, cv.COLOR_BGR2GRAY)

const outData = {
  data: bwImg.data,
  width: bwImg.size().width,
  height: bwImg.size().height,
}
const outJpegData = jpeg.encode(outData, 100)

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
