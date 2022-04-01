/**
 * @description reactivity function test
 * @author jerry
 */

import { reactive } from "../../src/reactivity/reactive";

describe('reactivity/reactive', () => {
    test('Object', () => {
        const original = { num: 1 };
        const observed = reactive(original);
        expect(observed).not.toBe(original);
        
    })
})

