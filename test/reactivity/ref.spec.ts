/**
 * @description ref 单元测试
 * @author jerry
 */

import { effect, trigger } from "../../src/reactivity/effect"
import { customRef, isRef, ref } from "../../src/reactivity/ref"

describe('测试ref', () => {
    it('结果包含value属性', () => {
        const test = ref(1)
        expect(test.value).toBe(1)
    })
    it('能够响应数据', () => {
        const num = ref(1)
        let temp, calls = 0
        effect(() => {
            calls++
            temp = num.value
        })
        expect(calls).toBe(1)
        expect(temp).toBe(1)
        num.value = 2
        expect(calls).toBe(2)
        expect(temp).toBe(2)
        // 相同值不会触发依赖响应
        num.value = 2
        expect(calls).toBe(2)
    })
    it('能够处理普通对象', () => {
        const obj = ref({ count: 1})
        let temp
        effect(() => {
            temp = obj.value.count
        })
        expect(temp).toBe(1)
        obj.value.count = 2
        expect(temp).toBe(2)
    })
    it ('没有初始值也能起作用', () => {
        const unValue = ref()
        let temp
        effect(() => {
            temp = unValue.value
        })
        expect(temp).toBe(undefined)
        unValue.value = 1
        expect(temp).toBe(1)
    })
    test('自定义ref', () => {
        let value = 1
        let _trigger: () => void
        const custom = customRef((track, trigger) => ({
            get() {
                track()
                return value
            },
            set(newValue: number) {
                value = newValue
                _trigger = trigger
            }
        }))
        expect(isRef(custom)).toBe(true)
        let temp
        effect(() => {
            temp = custom.value
        })
        custom.value = 2
        expect(temp).toBe(1)
        _trigger!()
        expect(temp).toBe(2)
    })
})