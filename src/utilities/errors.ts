import { SPACE } from '../constants';

export function raiseError(...messages: string[]): never
export function raiseError(): never {
    throw new Error(Array.prototype.join.call(arguments, SPACE))
}
