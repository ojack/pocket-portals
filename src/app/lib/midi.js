const Bus = require('nanobus')

window.cc=Array(128).fill(0)

module.exports = class Midi extends Bus {
    constructor (){
        super()
        this.connect()

        this.inputs = []
        this.outputs = []
        this.currDevice = null

        this._cc = [] // store past cc values, only update on change
    }

    initDevices(midi) {
        this.inputs = [];
        this.outputs = [];
        
        // MIDI devices that send you data.
        const inputs = midi.inputs.values();
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            this.inputs.push(input.value);
        }
        
        // MIDI devices that you send data to.
        const outputs = midi.outputs.values();
        for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
          this.outputs.push(output.value);
        }

       this._cc = this.outputs.map(() => new Array(100).fill(0).map(() => new Array(127).fill(0)))

        this.emit('device update', this.inputs, this.outputs)

        if(this.outputs.length > 0) {
            this.currDevice = 0
        }

        const midiMessageReceived = (e, input) => {
            // console.log(e, input)
            var arr = e.data    
            var index = arr[1]
            //console.log('Midi received on cc#' + index + ' value:' + arr[2])    // uncomment to monitor incoming Midi
            var val = (arr[2]+1)/128.0  // normalize CC values to 0.0 - 1.0
            window.cc[index]=val

            if(index === 6) {
                window.a.settings[0].cutoff = val * 40
            }
            if(index === 7) {
                window.a.settings[1].cutoff = val * 40
            }
            if(index === 22) {
                window.a.settings[0].scale = val * 20
            }

            if(index === 23) {
                window.a.settings[1].scale = val * 20
            }
        }

        // start listening
        for (const input of this.inputs) {
            input.addEventListener('midimessage', (e) => midiMessageReceived(e, input));
          }

        console.log('midi outputs', this.outputs)
    }

    select(i) {
        if(this.outputs.length > i) {
            this.currDevice = i
        }
    }

    note(pitch = 60, velocity = 100, duration = 100, channel = 0) {
        if(this.currDevice !== null) {
            const NOTE_ON = 0x90;
            const NOTE_OFF = 0x80;

            const channelOn = NOTE_ON + channel
            const channelOff = NOTE_OFF + channel
            
            const msgOn = [channelOn, pitch, velocity];
            const msgOff = [channelOff, pitch, velocity];
            
            // First send the note on;
           this.outputs[this.currDevice].send(msgOn); 
                
            // Then send the note off. You can send this separately if you want 
            // (i.e. when the button is released)
           this.outputs[this.currDevice].send(msgOff, performance.now() + duration); 
        }
    }

    cc(controller = 0, _val = 100, channel = 0) {
        if(this.currDevice!== null) {
          //  if(val >= 0 && val <= 127) {
              const val = Math.max(0, Math.min(_val, 127))
                const past = this._cc[this.currDevice][channel][controller]
                if(past !== val) {
                    const control = 0xB0
                   //console.log('sending', val)
                    this.outputs[this.currDevice].send([control + channel, controller, val])
                    this._cc[this.currDevice][channel][controller] = val
                }
           // }
        }
    }

    connect() {
        if(navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
            .then(
            (midi) => {
            // midi.addEventListener('statechange', (event) => this.initDevices(event.target));
                this.initDevices(midi)
            },
            (err) => console.log('Something went wrong', err))
        } else {
            console.warn('this browser does not accept midi')
        }

         
    }
}