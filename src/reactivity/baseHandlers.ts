/**
 * @description 监听对象为Object类型的捕获器方法
 * @author jerry
 */

import { Target } from "./reactive"

function createGetter(isReadonly = false, shallow = false) {
    // Proxy中get捕获器
    return function get(target: Target, key: string | symbol, receiver: object) {
        // todo 处理target中ReactiveFlags属性值

        const res = Reflect.get(target, key, receiver)

        if (!isReadonly) {
            // todo track实现
        }

        if (shallow) {
            return res
        }

        return res
    }
}

function createSetter(shallow = false) {
    return function set(
        target: object, 
        key: string | symbol, 
        value: unknown, 
        receiver: object
    ): boolean {
        // todo 边界处理
        const res = Reflect.set(target, key, value, receiver);
        // todo trigger实现
        return res
    }
}

const get = createGetter()
const set = createSetter()

export const mutableHandlers: ProxyHandler<object> = {
    get,
    set,
}



