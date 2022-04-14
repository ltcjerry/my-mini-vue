import { effect } from "../../src/reactivity/effect"
import { reactive } from "../../src/reactivity/reactive"

describe('reactivity/effect', () => {
    it('向effect函数传入一个自定义函数，只执行一次', () => {
        const fnSpy = jest.fn(() => {})
        effect(fnSpy)
        expect(fnSpy).toHaveBeenCalledTimes(1)
    })
    it('应该监听普通属性集', () => {
        let dummy
        const counter = reactive({ num: 0 })
        effect(() => (dummy = counter.num))
        expect(dummy).toBe(0)
        counter.num = 7
        expect(dummy).toBe(7)
    })
})