import { effect } from "../../src/reactivity/effect"
import { reactive } from "../../src/reactivity/reactive"

describe('reactivity/effect', () => {
    it('向effect函数传入一个自定义函数，只执行一次', () => {
        const fnSpy = jest.fn(() => {})
        effect(fnSpy)
        expect(fnSpy).toHaveBeenCalledTimes(1)
    })
    it('可以监听普通属性集', () => {
        let temp
        const counter = reactive({ num: 0 })
        effect(() => (temp = counter.num))
        expect(temp).toBe(0)
        counter.num = 7
        expect(temp).toBe(7)
    })
    it('可以监听多个属性', () => {
        let temp 
        const counter = reactive({ one: 0, other: 0})
        effect(() => (temp = counter.one + counter.other))
        expect(temp).toBe(0)
        counter.one = counter.other = 7
        expect(temp).toBe(14)
    })
    it('可以处理多个effect', () => {
        let temp1, temp2
        const counter = reactive({num: 0})
        effect(() => (temp1 = counter.num))
        effect(() => (temp2 = counter.num))
        expect(temp1).toBe(0)
        expect(temp2).toBe(0)
        counter.num++
        expect(temp1).toBe(1)
        expect(temp2).toBe(1)
    })
})