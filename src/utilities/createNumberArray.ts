import { FloatArray } from '../types'
import { isEdge } from './browser';

const arrayConstructor = isEdge ? Array : Float32Array

export function createNumberArray(n: number): FloatArray {
    return new arrayConstructor(n)
}
