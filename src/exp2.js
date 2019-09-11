import { Noise } from 'noisejs'

const Colors = {
  white: [255, 255, 255],
  red: [255, 0, 0],
  dark_green: [0, 120, 5],
  green: [0, 255, 0],
  blue: [0, 0, 255],
  black: [0, 0, 0],
  road: [128, 128, 0],
  yellow: [256, 256, 0]
}

const city_size = 20
const biome_size = 40
const continent_size = 5000

export default class App {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.addEventListener('wheel', e => this.scroll(e), true)
    this.canvas.addEventListener('touchmove', e => this.scroll(e), true)

    let drag = e => this.drag(e)
    let draw = e => this.draw()

    this.canvas.addEventListener('mousedown', function(e) {
      this.addEventListener('mousemove', drag)
    })
    this.canvas.addEventListener('mouseup', function(e) {
      this.removeEventListener('mousemove', drag)
      draw()
    })

    this.noise = new Noise()
    this.zoom = 3
    this.naturalZoom = 12
    this.size = 400
    this.xOffset = -this.size / 2
    this.yOffset = -this.size / 2
    this.scrollSpeed = this.size / 7
    this.drawing = false
    this.nextDraw = false
    this.canvas.width = this.size
    this.canvas.height = this.size
    this.image = this.ctx.createImageData(this.size, this.size)

    this.draw()

    console.log(new Date())
  }

  drag(evt) {
    // console.log(evt)
    this.yOffset += -evt.movementX / this.zoom
    this.xOffset += -evt.movementY / this.zoom
    this.draw()
  }

  scroll(evt) {
    if (!evt.deltaY) return

    let pos = evt.deltaY > 0 ? 1 : -1

    if (evt.altKey) {
      this.zoom *= Math.pow(Math.E, pos * -0.2)
      console.log(this.zoom)
    } else if (evt.shiftKey)
      this.yOffset += Math.floor(this.scrollSpeed / this.zoom) * pos
    else this.xOffset += Math.floor(this.scrollSpeed / this.zoom) * pos

    this.draw()
    return false
  }

  simplex(x, y, z) {
    // translate pixel input to map tile
    x = Math.floor(x / this.zoom) + this.xOffset
    y = Math.floor(y / this.zoom) + this.yOffset

    let color

    let noise6 = this.noise.simplex3(
      x / continent_size,
      y / continent_size,
      100
    )
    noise6 *= Math.pow(Math.E, 2)

    if (noise6 < -0.65) {
      let noise3 = this.noise.perlin2(x / city_size, y / city_size)
      noise3 = (noise3 + 1) / 2
      noise3 *= Math.pow(Math.E, 0.9)

      // let color = Colors.black()

      if (noise3 <= 0.5) {
        color = this.getCity(x, y)
      } else {
        color = this.getBiome(x, y)
      }
    } else {
      color = Colors.blue
    }

    // draw tiles
    // let value = Math.floor(x / city_size) + Math.floor(y / city_size)
    // if (value & 1) {
    //   color = [color[0], color[1], color[2]]
    //   for (let ind = 0; ind < 3; ind++) {
    //     color[ind] *= 0.5
    //   }
    // }

    return color
  }

  getCity(x, y) {
    // build a city & decide roads
    let color
    let noise1 = this.noise.simplex3(x, y, 1)
    let noise2 = this.noise.simplex3(x, y, 3)

    if (x % 3 & 1 && noise1 > -0.1) color = Colors.road
    else if (y % 3 & 1 && noise2 > -0.1) color = Colors.road
    else color = Colors.black

    return color
  }

  getBiome(x, y) {
    let noise4 = this.noise.simplex3(
      x / biome_size / 10,
      y / biome_size / 10,
      6
    )
    noise4 *= Math.pow(Math.E, 0.8)

    let river = this.noise.simplex3(x / biome_size / 3, y / biome_size / 3, 13)
    river *= Math.pow(Math.E, 2)

    if (noise4 > -0.8) {
      if (river > -0.15 && river < 0.01) {
        if (river < -0.09) return Colors.yellow
        return Colors.blue
      }

      return this.getLandBiome(x, y)
    } else if (noise4 > -0.805 && !(river > -0.1 && river < 0.01))
      return Colors.yellow
    else return Colors.blue
  }

  getLandBiome(x, y) {
    let noise5 = this.noise.simplex3(x / biome_size / 2, y / biome_size / 2, 7)
    noise5 *= Math.pow(Math.E, 2)
    noise5 += this.noise.simplex3(
      (x / biome_size) * 2,
      (y / biome_size) * 2,
      34
    )

    if (noise5 > 0) return Colors.dark_green
    else return Colors.green
  }

  draw() {
    if (this.drawing) {
      this.nextDraw = true
      return
    }

    this.drawing = true

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = (i * this.size + j) * 4

        // rgb
        let color = this.simplex(i, j)
        for (let c = 0; c < 3; c++) {
          this.image.data[index + c] = color[c]
        }

        // alpha
        this.image.data[index + 3] = 255
      }
    }

    this.ctx.putImageData(this.image, 0, 0)

    this.drawing = false

    // if (this.nextDraw) {
    //   this.nextDraw = false
    //   this.draw()
    // }
  }
}
