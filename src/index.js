import canvas from './canvas.js'

let c = new canvas()

let commands = {
  coords: self =>
    self.echo(`${Math.round(c.xOffset)}, ${Math.round(c.yOffset)}`),
  jump: (self, args) => {
    c.xOffset = Number.parseFloat(args[1])
    c.yOffset = Number.parseFloat(args[2])
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
