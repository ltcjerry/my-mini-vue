/**
 * @description ref 单元测试
 * @author jerry
 */

import { ref } from "../../src/reactivity/ref"

describe('测试reactivity模块下的ref方法', () => {
    it('调用ref函数返回一个对象包含value属性', () => {
        const test = ref(1)
        expect(test.value).toBe(1)
    })
})