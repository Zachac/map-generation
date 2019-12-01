import canvas from './canvas.js'

console.log(new canvas())

$('#terminal').terminal(
  function(command) {
    if (command == 'test') {
      this.echo("you just typed 'test'")
    } else {
      this.echo('unknown command')
    }
  },
  { prompt: '>', name: 'test' }
)
