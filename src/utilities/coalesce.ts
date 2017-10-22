import { _ } from '../constants'

/**
 * Evaluates the value for undefined, the fallback value is used if true
 * @param current value to evaluate
 * @param fallback value to set if equal to undefined
 */
export function coalesce<T>(current: T, fallback: T): T {
    return current === _ ? fallback : current
}
