export type Func<TI, TO> = (t: TI) => TO

export function compose<T1, TO>(t1: Func<T1, TO>): Func<T1, TO>
export function compose<T1, T2, TO>(t1: Func<T1, T2>, t2: Func<T2, TO>): Func<T1, TO>
export function compose<T1, T2, T3, TO>(t1: Func<T1, T2>, t2: Func<T2, T3>, t3: Func<T3, TO>): Func<T1, TO>
export function compose(): any {
    const args = arguments
    const len = args.length

    return function(result: any): any {
        for (let i = 0; i < len; i++) {
            result = args[i].call(this, result)
        }
        return result
    }
}
