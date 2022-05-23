/**
 * @description ref 单元测试
 * @author jerry
 */

import { effect } from "reactivity/effect"
import { ref } from "reactivity/ref"

describe('测试reactivity模块下的ref方法', () => {
    it('调用ref函数返回一个对象包含value属性', () => {
        const test = ref(1)
        expect(test.value).toBe(1)
    })
    it('可以被监听', () => {
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
})