import { assert } from 'chai'
import { parsePath } from '../../src/operations/parse-path'

describe('parsePath()', () => {
    it('parses move (M | m)', () => {
        assert.deepEqual(parsePath('M 10 42'), [[10, 42]])
    })

    it('parses move (Z | z)', () => {
        assert.deepEqual(parsePath('M 10 42z'), [[10, 42, 10, 42, 10, 42, 10, 42]])
    })

    it('parses a relative horizontal line (h)', () => {
        assert.deepEqual(parsePath('M 10 0 h 10'), [[10, 0, 10, 0, 10, 0, 20, 0]])
    })
    it('parses an absolute horizontal line (H)', () => {
        assert.deepEqual(parsePath('M 10 0 H 20'), [[10, 0, 10, 0, 10, 0, 20, 0]])
    })

    it('parses a relative vertical line (v)', () => {
        assert.deepEqual(parsePath('M 0 10 v 10'), [[0, 10, 0, 10, 0, 10, 0, 20]])
    })
    it('parses an absolute vertical line (V)', () => {
        assert.deepEqual(parsePath('M 0 10 V 20'), [[0, 10, 0, 10, 0, 10, 0, 20]])
    })

    it('parses a relative line (l)', () => {
        assert.deepEqual(parsePath('M 10 10 l 10 10'), [[10, 10, 10, 10, 10, 10, 20, 20]])
    })
    it('parses an absolute line (L)', () => {
        assert.deepEqual(parsePath('M 10 10 L 20 20'), [[10, 10, 10, 10, 10, 10, 20, 20]])
    })

    it('parses a relative line (c)', () => {
        assert.deepEqual(parsePath('M 10 10 c 10 5 5 10 25 25'), [[10, 10, 20, 15, 15, 20, 35, 35]])
    })
    it('parses an absolute line (C)', () => {
        assert.deepEqual(parsePath('M 10 10 C 20 15 15 20 35 35'), [[10, 10, 20, 15, 15, 20, 35, 35]])
    })

    it('parses a relative line (s)', () => {
        assert.deepEqual(parsePath('M 10 10 s 10 5 25 25'), [[10, 10, 10, 10, 20, 15, 35, 35]])
    })
    it('parses an absolute line (S)', () => {
        assert.deepEqual(parsePath('M 10 10 S 20 15 35 35'), [[10, 10, 10, 10, 20, 15, 35, 35]])
    })

    // checkpoint
    it('parses a relative line (s) as a continuation of s', () => {
        const actual = parsePath('M 10 10 s 10 40 25 25 s 10 40 25 25')[0]
        console.log(actual)
        assert.deepEqual(actual, [10, 10, 10, 10, 20, 50, 35, 35, 50, 20, 45, 75, 60, 60])
    })

    it('parses a relative line (q)', () => {
        assert.deepEqual(parsePath('M 10 10 q 10 5 25 25'), [[10, 10, 20, 15, 20, 15, 35, 35]])
    })
    it('parses an absolute line (Q)', () => {
        assert.deepEqual(parsePath('M 10 10 Q 20 15 35 35'), [[10, 10, 20, 15, 20, 15, 35, 35]])
    })
})
