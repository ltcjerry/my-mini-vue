/**
 * @description reactivity function test
 * @author jerry
 */

import { isReactive, reactive } from "../../src/reactivity/reactive";

describe('测试reactivity模块下的reactive', () => {
    test('Object', () => {
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
})
