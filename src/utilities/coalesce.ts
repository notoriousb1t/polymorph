import { _ } from '../constants'

export function coalesce<T>(current: T, fallback: T): T {
    return current === _ ? fallback : current
}
