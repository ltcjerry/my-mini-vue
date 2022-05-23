/**
 * @description reactivity function test
 * @author jerry
 */

import { isReactive, reactive } from "reactivity/reactive";

describe('测试reactivity模块下的reactive方法', () => {
    test('普通对象类型object', () => {
        const original = { num: 1 };
        const observed = reactive(original);
        expect(observed).not.toBe(original);
        expect(isReactive(observed)).toBe(true);
        expect(isReactive(original)).toBe(false);
        // get捕获器
        expect(observed.num).toBe(1);
        // has捕获器
        expect('num' in observed).toBe(true);
        // ownKeys捕获器
        expect(Object.keys(observed)).toEqual(['num']);
    })
    test('内部对象类型代理', () => {
        const original = {
            nested: { num: 1 },
            arr: [{bar: 2}]
        };
        const observed = reactive(original);
        expect(isReactive(observed.nested)).toBe(true);
        expect(isReactive(observed.arr)).toBe(true);
        expect(isReactive(observed.arr[0])).toBe(true);
    })

    test('集合类型代理', () => {
        const map = reactive(new Map())
        map.set('key', {})
        expect(isReactive(map.get('key'))).toBe(true)
        const set = reactive(new Set())
        expect(isReactive(set)).toBe(true)

    })
    test('代理对象和目标对象应该发生相同的变化', () => {
        const original: any = {num: 1}
        const observed = reactive(original)
        // set
        observed.other = 2
        expect(observed.other).toBe(2)
        expect(original.other).toBe(2)
        // delete
        delete observed.num
        expect('num' in observed).toBe(false)
        expect('num' in original).toBe(false)
    })
    test('给代理对象添加一个类型为Object的值，这个值应该被代理', () => {
        const observed = reactive<{addKey?: object}>({})
        const raw = {}
        observed.addKey = raw
        expect(observed.addKey).not.toBe(raw)
        expect(isReactive(observed.addKey)).toBe(true)
    })
    test('如果reactive传入的是代理对象，则直接返回这个代理对象', () => {
        const original = { num: 1 }
        const observed = reactive(original)
        const observedNext = reactive(observed)
        expect(observedNext).toBe(observed)
    })
    test('多次代理相同的目标对象，预期返回同一代理对象', () => {
        const original = { num: 1 }
        const observed = reactive(original)
        const observed2 = reactive(original)
        expect(observed).toBe(observed2)
    })
})

