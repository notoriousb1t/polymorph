import { IAnimateOptions } from "./types";
import { mix } from "./mix";
import { Nm810, nm8 } from "./third_party/nm8";

export function animate(options: IAnimateOptions): Nm810 {
  const easing = options.easing || (o => o);
  let target = options.target;
  if (typeof options.target === "string") {
    target = document.querySelector(target as string);
  }

  const mixer = mix(options);
  return nm8((offset: number) => {
    offset = easing(offset);
    (target as Element).setAttribute("d", mixer(offset));
  }, options.duration);
}
