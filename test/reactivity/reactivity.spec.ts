/**
 * @description reactivity function test
 * @author jerry
 */

import { isReactive, reactive } from "../../src/reactivity/reactive";

describe('测试reactivity模块下的reactive', () => {
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
})

