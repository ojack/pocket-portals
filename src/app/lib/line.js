

module.exports = class Line {
    constructor ({ interval = 100 } = {}) {
        this.interval = interval

        this._lastUpdate = 0
        this.points = []
        this.marker = null
        this.isRecording = true
        this.startTime = 0
        this.duration = 0
        this.numTransforms = 0 // number of times the path has been moved 
       // this.mode = 'wrap'
        this.read = ({x, y} = {}) => {

        }
        this.trigger = () => {
            console.log('calling trigger')
        }
    }

    addPoint (_p) {
        console.log(_p.t, _p)
        const p = Object.assign({}, _p, { t: _p.t - this.startTime})
        this.points.push(p)
        this.marker = p
        this.isRecording = true
    }

    startRecording(t) {
        this.startTime = t
        this.numTransforms = 0
    }
    stopRecording() {
        const p = this.points
        this.isRecording = false
        this.duration =  p[p.length - 1].t
        console.log(this.startTime, this.duration, this)
    }

    clear() {
        this.points = []
        this.marker = null
    }

    update (t) {
        // update time to value based on t passed in
        if(!this.isRecording && this.points.length > 1) {
          
            // const start = p[0].t
            // const dur = end - start
            const progress = (t - this.startTime)%this.duration

            if(this.mode === 'wrap') {
                const numReps = Math.floor((t- this.startTime)/this.duration)
                if(numReps > this.numTransforms) this.transformPath()
            }
            const p = this.points
            
            let index = 0
            let time = p[index].t
            while(progress > time && index < p.length - 1){
                index++
                time = p[index].t
            }
            const point = p[index]
            this.marker = point
            // if(this.mode = 'wrap') {
            //     const end = p[p.length - 1]
            //     const start = p[0]
                
            //     const newP = Object.assign({}, point, {
            //         x: (end.x + (point.x-start.x))%800,
            //         y: (end.y + (point.y-start.y))%800
            //     })
            //     this.marker = newP
            //     console.log(newP)
            // }
           // console.log(progress, this.duration)
        }
    }

    // for continuous animation, update point when reaches end
    transformPath() {
        const points = this.points
        const end = points[points.length - 1]
        const start = points[0]

        const newPoints = this.points.map((p) => Object.assign({}, p, {
            x: (end.x + (p.x-start.x))%800,
            y: (end.y + (p.y-start.y))%800
        }))

        this.points = newPoints
        this.numTransforms ++
    }
}