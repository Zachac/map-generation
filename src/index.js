import canvas from './canvas.js'

let c = new canvas()

let commands = {
  coords: self =>
    self.echo(`${Math.round(c.xOffset)}, ${Math.round(c.yOffset)}`),
  jump: (self, args) => {
    c.xOffset = Number.parseFloat(args[1])
    c.yOffset = Number.parseFloat(args[2])
    c.draw()
  },
  go: (self, args) => {
    switch (args[1]) {
      case 'n':
        c.xOffset -= 30
        break
      case 's':
        c.xOffset += 30
        break
      case 'w':
        c.yOffset -= 30
        break
      case 'e':
        c.yOffset += 30
        break
      default:
        throw new Error('Excpected direction n/s/e/w')
    }

    c.draw()
  }
}

$('#terminal').terminal(
  function(command) {
    if (command) {
      let args = command.split(/\s+/)
      let exe = commands[args[0]]

      if (exe) {
        try {
          exe(this, args)
        } catch (err) {
          this.error(err.message)
        }
      } else {
        this.echo('unknown command')
      }
    }
  },
  { prompt: '>', name: 'test' }
)
