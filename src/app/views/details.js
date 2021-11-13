const html = require('choo/html')

// property types for different properties:
// -- 'xy' : PIXI observable point
// --
const params = [ 
  { key: 'scale', type: 'xy' }, 
  { key: 'skew', type: 'xy' }, 
  { key: 'position', type: 'xy'},
  { key: 'angle', type: 'number'}
]

//'rotation', 'width', 'height','position', 'fill']

const showParam = (key="", value = "", handleInput=()=>{}, type="number") => html`<div>
    <div class="dib pr2 gray bg-white pv0 pl1">${key}:</div>
    <input style="border:none" class="dib w4 bg-white pv0" type=${type} id=${key} name="fname" step="0.5" value=${value} oninput=${handleInput}>
   </div>`

const showXY = (key, point) => {
  console.log('type', typeof point)
  return ['x', 'y'].map((i) => showParam(
  `${key}${i}`,point[i], (e) => point.set(e.target.value)
  ))
}

const showNumber = (key, val, parent) => showParam(
  key, val, (e) => { parent[key] = e.target.value}
)

const showByType = {
  xy: showXY,
  number: showNumber
}

module.exports = (obj, emit) => {
  console.log('object', obj)
  // show paramerties of object
  if(obj === null) return html`<div></div>`

  return html`<div class="pa2 overflow-y-auto" style="height:20em;">${params.map((param) => showByType[param.type](param.key, obj[param.key], obj))}</div>`
  // const input = (key, value) => {
  //   const handleInput = (e) => {
  //   //  console.log(key, e.target.value, typeof e.target.value, parseFloat(e.target.value))
  //     let val = typeof value === 'number' ? parseFloat(e.target.value) : e.target.value
  //     obj.set(key, val)
  //   //obj.set('top', 224)
  //     emit('render canvas')
  //   }
  //   let type = 'text'
  //   if(typeof value === 'number') type = 'number'
  // //  console.log(value, typeof value)
  //   return html`<div>
  //     <div class="dib pr2 gray bg-white pv0 pl1">${key}:</div>
  //     <input style="border:none" class="dib w4 bg-white pv0" type=${type} id=${key} name="fname" value=${value} oninput=${handleInput}>
  //   </div>`
  // }
  // return html`<div class="pa2 overflow-y-auto" style="height:20em;">${obj.stateparamerties.map((param) => input(param, obj[param]))}</div>`
}
