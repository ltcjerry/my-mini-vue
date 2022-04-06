/**
 * @description reactivity function test
 * @author jerry
 */

import { isReactive, reactive } from "../../src/reactivity/reactive";

describe('reactivity/reactive', () => {
    test('Object', () => {
        const original = { num: 1 };
        const observed = reactive(original);
        expect(observed).not.toBe(original);
        // get捕获器
        expect(observed.num).toBe(1);
        // has捕获器
        expect('num' in observed).toBe(true);
    })
})

