# About Polymorph

Polymorph is a lightweight SVG morphing library that is built to work with your animation library.  Using a simple 0 to 1 function, it morphs smoothly between two shapes.  Follow the setup to get started.

- [Setup Guide](./setup.md)
- [API Reference](./api.md)

## How does it work?

The core idea in Polymorph is that all path commands can be translated to poly-bezier approximations.  For example, if the path includes the A (arc command), that can be translated to 1 to 3 cubic beziers.  The two paths are normalized (additional points and subpaths are added as needed) and then the paths are aligned.  

Doing this by hand is cumbersome, so polymorph uses a fast algorithm to do it for you!

## Guides

Get morphing with these animation library guides:

- [Popmotion Guide](/guide/getting-started-popmotion.md) _(Coming Soon)_
- [Just Animate Guide](/guide/getting-started-just-animate.md) _(Coming Soon)_
- [nm8 Guide](/guide/getting-started-nm8.md) _(Coming Soon)_
- [TweenRex Guide](/guide/getting-started-tweenrex.md) _(Coming Soon)_
- [GSAP Guide](/guide/getting-started-gsap.md) _(Coming Soon)_
