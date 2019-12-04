import { tile } from './tiles.js'

export default class App {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')

    let drag = e => this.drag(e)

    this.canvas.addEventListener('wheel', e => this.scroll(e), true)
    this.canvas.addEventListener('touchmove', e => this.scroll(e), true)
    this.canvas.addEventListener('mousedown', function(e) {
      this.addEventListener('mousemove', drag)
    })

    this.canvas.addEventListener('mouseup', function(e) {
      this.removeEventListener('mousemove', drag)
    })

    this.canvas.ondblclick = e => console.log(this)

    this.zoom = 3
    this.naturalZoom = 12
    this.size = 400
    this.xOffset = -this.size / 2
    this.yOffset = -this.size / 2
    this.scrollSpeed = this.size / 7
    this.canvas.width = this.size
    this.canvas.height = this.size
    this.image = this.ctx.createImageData(this.size, this.size)
    this.drawing = false

    this.draw()
  }

  drag(evt) {
    if (! evt.buttons & 1) {
      this.removeEventListener('mousemove', this.drag)
      return
    }

    // console.log(evt)
    let oldx = this.xOffset
    let oldy = this.yOffset
    this.yOffset += -evt.movementX / this.zoom
    this.xOffset += -evt.movementY / this.zoom

    if (oldx & (1 !== this.xOffset) & 1 || oldy & (1 !== this.yOffset) & 1) {
      this.draw()
    }
  }

  scroll(evt) {
    if (!evt.deltaY) return

    let pos = evt.deltaY > 0 ? 1 : -1

    if (evt.altKey) {
      this.zoom *= Math.pow(Math.E, pos * -0.2)
    } else if (evt.shiftKey)
      this.yOffset += (this.scrollSpeed / this.zoom) * pos
    else this.xOffset += (this.scrollSpeed / this.zoom) * pos

    this.draw()

    evt.preventDefault()
  }

  draw() {
    if (this.drawing) return
    this.drawing = true

    let tileFunction = this.zoom < 1 ? tile : this.getCachedTileFunction()

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = (i * this.size + j) * 4

        // translate pixel input to map tile & get biome
        let color = tileFunction(
          Math.floor(i / this.zoom + this.xOffset),
          Math.floor(j / this.zoom + this.yOffset)
        )
        for (let c = 0; c < 3; c++) {
          this.image.data[index + c] = color[c]
        }

        // alpha
        this.image.data[index + 3] = 255
      }
    }

    this.ctx.putImageData(this.image, 0, 0)
    this.drawing = false
  }

  getCachedTileFunction() {
    let minx = Math.floor(this.xOffset)
    let miny = Math.floor(this.yOffset)
    let maxx = Math.floor(this.size / this.zoom + this.xOffset)
    let maxy = Math.floor(this.size / this.zoom + this.yOffset)

    var data = new Array(maxy - miny)

    for (let i = minx; i <= maxx; i++) {
      data[i - minx] = new Array(maxx - minx)

      for (let j = miny; j <= maxy; j++) {
        data[i - minx][j - miny] = tile(i, j)
      }
    }

    return (x, y) => data[x - minx][y - miny]
  }
}
