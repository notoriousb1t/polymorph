# Setup

Polymorph can either be setup to use a prebuilt CDN script or it can be bundled during development using npm or yarn.

## Setup for CDN

Include this script to get the latest version

```html
<script src="https://unpkg.com/polymorph-js/dist/polymorph.min.js"></script>
```

To lock to a specific version, add @version after polymorph-js.  For example, to lock to version 0.2.2, use the following url instead: ```https://unpkg.com/polymorph-js@0.2.2/dist/polymorph.min.js```


## Setup for NPM

Polymorph builds for UMD, node, and es2015 modules.  Install it on the command line with the following npm command:

```bash
npm install polymorph-js --save
```

To use the prebuilt version, resolve to the ```/dist/polymorph.js``` file in node_modules.  Otherwise, simply import interpolate in your files:

```ts
import { interpolate } from 'polymorph-js'

const mixer = interpolate(/* ... */);
```