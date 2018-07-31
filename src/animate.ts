
import { IAnimateOptions } from './types';
import { mix } from './mix';
import { Nm810, nm8 } from './tmp/nm8';

export function animate(options: IAnimateOptions): Nm810 {
    let target = options.target;
    if (typeof options.target === 'string') {
        target = document.querySelector(target as string);
    }

    const mixer = mix(options);
    return nm8((offset: number) => { (target as Element).setAttribute('d', mixer(offset)) }, options.duration);
}