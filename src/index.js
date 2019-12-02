import canvas from './canvas.js'

let c = new canvas()

let commands = {
  coords: self =>
    self.echo(`${Math.round(c.xOffset)}, ${Math.round(c.yOffset)}`)
}

$('#terminal').terminal(
  function(command) {
    if (command) {
      let args = command.split(/\s+/)
      let exe = commands[args[0]]

      if (exe) {
        exe(this, args)
      } else {
        this.echo('unknown command')
      }
    }
  },
  { prompt: '>', name: 'test' }
)
