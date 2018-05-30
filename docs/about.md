# About Polymorph

Polymorph is a lightweight SVG morphing library that is built to work with your animation library.  Using a simple 0 to 1 function, it morphs smoothly between two shapes


## How does it work?

The base idea behind Polymorph is that all path commands can be translated to polybezier approximations.  For example, if the path includes the A (arc command), that can be translated to 1 to 3 cubicbeziers.  Polymorph will then align points in the two paths it is tweening between and add additional points and empty shapes to optimize them.  Doing this by hand is cumbersome, so polymorph uses a fast algorithm to do it for you!

## Guides

Get morphing with these animation library guides:

- Getting Started with Popmotion _(Coming Soon)_
- Getting Started with Just Animate _(Coming Soon)_
- Getting Started with nm8 _(Coming Soon)_
- Getting Started with TweenRex _(Coming Soon)_
- Getting Started with GSAP _(Coming Soon)_

## Getting Started

- [Setup](./setup.md)
- [API Reference](./api.md)

