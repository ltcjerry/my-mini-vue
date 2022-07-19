import { computed } from "../src/reactivity/computed"
import { reactive } from "../src/reactivity/reactive"

describe('响应系统下计算函数', () => {
    it('应该返回一个更新的值', () => {
        const value = reactive<{temp?: number}>({})
        const cValue = computed(() => value.temp)
        expect(cValue.value).toBe(undefined)
        value.temp = 1
        expect(cValue.value).toBe(1)
    })

    it('计算函数应该为惰性函数', () => {
        const vlaue = reactive<{temp?: number}>({})
        const getter = jest.fn(() => vlaue.temp)
        const cValue = computed(getter)
        expect(getter).not.toHaveBeenCalled()
        expect(cValue.value).toBe(undefined)
        expect(getter).toHaveBeenCalledTimes(1)
        vlaue.temp = 1
        expect(getter).toHaveBeenCalledTimes(1)
        expect(cValue.value).toBe(1)
        expect(getter).toHaveBeenCalledTimes(2)
    })
})