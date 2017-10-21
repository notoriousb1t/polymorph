import { assert } from 'chai'
import { parsePath } from '../../src/operations/parse-path'

describe('parsePath()', () => {
    it('parses move (M | m)', () => {
        assert.deepEqual(parsePath('M 10 42'), [[10, 42]])
    })

    it('parses move (Z | z)', () => {
        assert.deepEqual(parsePath('M 10 42z'), [[10, 42, 10, 42, 10, 42, 10, 42]])
    })

    it('parses h', () => {
        assert.deepEqual(parsePath('M 10 50 h 50'), [[10, 50, 10, 50, 10, 50, 60, 50]])
    })
    it('parses H', () => {
        assert.deepEqual(parsePath('M 10 50 H 60'), [[10, 50, 10, 50, 10, 50, 60, 50]])
    })
    it('parses v', () => {
        assert.deepEqual(parsePath('M 50 10 v 50'), [[50, 10, 50, 10, 50, 10, 50, 60]])
    })
    it('parses V', () => {
        assert.deepEqual(parsePath('M 50 10 V 60'), [[50, 10, 50, 10, 50, 10, 50, 60]])
    })
    it('parses l', () => {
        assert.deepEqual(parsePath('M 10 10 l 10 10'), [[10, 10, 10, 10, 10, 10, 20, 20]])
    })
    it('parses L', () => {
        assert.deepEqual(parsePath('M 10 10 L 20 20'), [[10, 10, 10, 10, 10, 10, 20, 20]])
    })
    it('parses c', () => {
        assert.deepEqual(parsePath('M 10 10 c 10 5 5 10 25 25'), [[10, 10, 20, 15, 15, 20, 35, 35]])
    })
    it('parses C', () => {
        assert.deepEqual(parsePath('M 10 10 C 20 15 15 20 35 35'), [[10, 10, 20, 15, 15, 20, 35, 35]])
    })
    it('parses s', () => {
        assert.deepEqual(parsePath('M 10 10 s 50 35 55 85'), [[10, 10, 10, 10, 60, 45, 65, 95]])
    })
    it('parses s + s', () => {
        assert.deepEqual(parsePath('M 10 10 s 10 40 25 25 s 10 40 25 25'), [
            [10, 10, 10, 10, 20, 50, 35, 35, 50, 20, 45, 75, 60, 60]
        ])
    })
    it('parses S', () => {
        assert.deepEqual(parsePath('M 10 10 S 20 15 35 35'), [[10, 10, 10, 10, 20, 15, 35, 35]])
    })
    it('parses S + S', () => {
        assert.deepEqual(parsePath('M 10 10 S 20 50 35 35 S 45 75 60 60'), [
            [10, 10, 10, 10, 20, 50, 35, 35, 50, 20, 45, 75, 60, 60]
        ])
    })
    it('parses q', () => {
        assert.deepEqual(parsePath('M 10 10 q 10 5 15 25'), [[10, 10, 20, 15, 20, 15, 25, 35]])
    })
    it('parses Q', () => {
        assert.deepEqual(parsePath('M 10 10 Q 20 15 25 35'), [[10, 10, 20, 15, 20, 15, 25, 35]])
    })
    it('parses t', () => {
        assert.deepEqual(parsePath('M 10 10 t 15 25'), [[10, 10, 10, 10, 10, 10, 25, 35]])
    })
    it('parses t + t', () => {
        assert.deepEqual(parsePath('M 10 10 t 15 25 t 25 15'), [
            [10, 10, 10, 10, 10, 10, 25, 35, 40, 60, 40, 60, 50, 50]
        ])
    })
    it('parses T', () => {
        assert.deepEqual(parsePath('M 10 10 T 25 35'), [[10, 10, 10, 10, 10, 10, 25, 35]])
    })
    it('parses T + T', () => {
        assert.deepEqual(parsePath('M 10 10 T 25 35 T 70 50'), [
            [10, 10, 10, 10, 10, 10, 25, 35, 40, 60, 40, 60, 70, 50]
        ])
    })
})
