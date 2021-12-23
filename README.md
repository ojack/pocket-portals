
### 
```javascript
p0.interval = () => choose([125, 500])
p0.bang = (p) => { // what to do on each trigger}

p0.set({
    interval: 
    trigger:
})

pAll.set({
    interval: 200
})
```

```javascript
p0.set({
  interval: () => 250,
  trigger: ({ y, x, value} ) => {
    midi.note(quantize(1 - y/height, notes), 100)
  }
})

```

### Utility functions
`choose([1, 2, 4])` randomly selects from values
`quantize(value, array)` maps a value between 0 and 1 to an element of an array
`rand(min, max)` gets a random value



