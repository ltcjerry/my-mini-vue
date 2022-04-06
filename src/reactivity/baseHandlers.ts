/**
 * @description 监听对象为Object类型的捕获器方法
 * @author jerry
 */

import { hasOwn, isSymbl } from "../shared"
import { Target } from "./reactive"

// 获取全局内置的Symbl对象属性名
const builtInSymbols = new Set(
    Object.getOwnPropertyNames(Symbol)
    .map(key => (Symbol as any)[key])
    .filter(isSymbl)
)
// 对get捕获器进行封装，通过外部参数控制内部不同行为
function createGetter(isReadonly = false, shallow = false) {
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
// 对get捕获器进行封装，通过外部参数控制内部不同行为
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
// has捕获器
function has(target: object, key: string | symbol): boolean {
    const res = Reflect.has(target, key)
    if (!isSymbl(key) || !builtInSymbols.has(key)) {
        // track实现
    }
    return res
}
// ownkeys捕获器
function ownKeys(target: object): (string | symbol)[] {
    // track实现
    return Reflect.ownKeys(target)
}
// deleteProperty捕获器
function deleteProperty(target: object, key: string | symbol): boolean {
    const hadKey = hasOwn(target, key)
    const oldVal = (target as any)[key]
    const res = Reflect.deleteProperty(target, key)
    if (hadKey && oldVal) {
        // trigger实现
    }
    return res
}


const get = createGetter()
const set = createSetter()

export const mutableHandlers: ProxyHandler<object> = {
    get,
    set,
    has,
    ownKeys,
    deleteProperty
}



