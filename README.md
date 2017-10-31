# Polymorph

*Morph SVG Paths*

[![npm version](https://badge.fury.io/js/polymorph-js.svg)](https://badge.fury.io/js/polymorph-js)
[![Build Status](https://travis-ci.org/notoriousb1t/polymorph.svg?branch=master)](https://travis-ci.org/notoriousb1t/polymorph)
[![Downloads](https://img.shields.io/npm/dm/polymorph-js.svg)](https://www.npmjs.com/package/polymorph-js)
[![gzip size](http://img.badgesize.io/https://unpkg.com/polymorph-js/dist/polymorph.min.js?compression=gzip&label=gzip%20size&style=flat&cache=false)](https://unpkg.com/polymorph-js/dist/polymorph.min.js)

## Features

 - morphs between two or more svg paths using a simple function
 - handles variable length paths and holes in paths
 - compatible with Just Animate and Popmotion animation libraries
 - Super tiny, about 5k minified
 - Free for commercial and non-commerical use under the MIT license

## How to Use

### interpolate(paths, options)
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

#### paths
An array of path data.  Each item can be a PathElement, a CSS selector, or a path string ('M0,0 ...')

#### options
Name | Description |
--- | --- |
addPoints | Adds additional points to each side of the tween over what is required.  This takes effect when optimize is set to ```fill```.  The default value is ```0```. |
origin | Percentage based reference point for realigning paths scaling subpaths in and out. The ```x``` and ```y``` value should be ```0``` to ```1``` represention 0% to 100%.  This is similar to transform-origin in CSS.  The default value is ```{ x: 0, y: 0 }``` (upper left corner) |
optimize | Determines the strategy for aligning two disparate shapes. ```none``` does nothing.  ```fill``` creates new subpaths as needed and inserts additional points as needed.  The default value is ```fill```. |
precision | The number of decimal places to use when rendering paths.  Increasing this value smoothes out shapes at the cost of browser rendering speed.  The default value is ```0``` |

## Setup

### Setup for CDN
Include this script
```html
<script src="https://unpkg.com/polymorph-js/dist/polymorph.min.js"></script>
```

### Setup for NPM
```bash
npm install polymorph-js --save
```

## Current Limitations

- The only known limitation is that it cannot yet handle the A path command.  If you know how to convert from the arc command to the cubic bezier command, please create a pull request.  It would be greatly appreciated.

## License
This library is licensed under MIT.

## Contributions / Questions
Please create an issue for questions or to discuss new features.
