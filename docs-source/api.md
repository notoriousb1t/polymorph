

# API Reference

## interpolate(paths, options)
Returns a function that interpolates between two or more paths.

```js
// create function to interpolate between the two paths
const interpolator = polymorph.interpolate(['#play', '#pause'], {
   addPoints: 0,
   origin: { x: 0, y: 0 },
   optimize: 'fill',
   precision: 0
})

// pass a number between 0 and 1. 0.5 is 50% in the middle.
const midway = interpolator(0.5)
```

### paths
An array of path data.  Each item can be a PathElement, a CSS selector, or a path string ('M0,0 ...')

### options
Name | Description |
--- | --- |
addPoints | Adds additional points to each side of the tween over what is required.  This takes effect when optimize is set to ```fill```.  The default value is ```0```. |
origin | There are two modes to origin: absolute and relative. When absolute is true, ```x``` and ```y``` are exact coordinates in the SVG space.  When absolute is false, ```x``` and ```y``` are values between ```0``` and ```1``` representing 0% to 100% of the bounding box of the path. This is similar to transform-origin in CSS.  The default value is ```{ x: 0, y: 0, absolute: false }``` (upper left corner of the bounding box of the path) |
optimize | Determines the strategy for aligning two disparate shapes. ```none``` does nothing and should be used when the paths are optimized by hand.  ```fill``` creates new subpaths as needed and inserts additional points as needed.  The default value is ```fill```. |
precision | The number of decimal places to use when rendering paths.  Increasing this value smooths out shapes at the cost of browser rendering speed on some platforms.  The default value is ```0``` |


