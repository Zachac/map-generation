import { Noise } from 'noisejs'

export default class App {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.init()
  }

  init() {
    const size = 512
    const n = new Noise()
    const res = 0.0025

    this.canvas.width = size
    this.canvas.height = size

    let image = this.ctx.createImageData(size, size)

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = (i * size + j) * 4
        for (let c = 0; c < 3; c++) {
          image.data[index + c] =
            ((n.perlin2(i * res * 4 + 1000 * c, j * res * 4 + 1000 * c) * 128 +
              1) /
              2 +
              (n.perlin2(i * res * 8 + 1000 * c, j * res * 8 + 1000 * c) * 64 +
                1) /
                2 +
              (n.perlin2(i * res * 16 + 1000 * c, j * res * 16 + 1000 * c) *
                32 +
                1) /
                2 +
              (n.perlin2(i * res * 32 + 1000 * c, j * res * 32 + 1000 * c) *
                16 +
                1) /
                2) *
            255
        }
        image.data[index + 3] = 255
      }
    }

    this.ctx.putImageData(image, 0, 0)
  }
}
