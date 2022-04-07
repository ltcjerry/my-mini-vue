/**
 * @description 监听对象为Object类型的捕获器方法
 * @author jerry
 */

import { hasOwn, isArray, isObject, isSymbl } from "../shared"
import { reactive, ReactiveFlags, Target, toRaw } from "./reactive"

// 获取全局内置的Symbl对象属性名数组
const builtInSymbols = new Set(
    Object.getOwnPropertyNames(Symbol)
    .map(key => (Symbol as any)[key])
    .filter(isSymbl)
)

// 对数组的几个方法进行封装
function createArrayInstrumentations() {
    const instrumentations: Record<string, Function> = {};
    // 下面这三个数组方法需要track
    (['includes', 'indexOf', 'lastIndexOf'] as const).forEach(key => {
        instrumentations[key] = function(this: unknown[], ...args: unknown[]) {
            const arr = toRaw(this) as any
            for(let i = 0, len = this.length; i < len; i++) {
                // 对数组中的每一项进行track处理
            }
            // 执行对数组的操作，获取返回值
            const res = arr[key](...args)
            return res
        }
    });
    // 下面这个几个数组方法需要阻止track,以免导致某种情况下的无限循环
    (['push', 'pop', 'shift', 'unshift', 'splice'] as const).forEach(key => {
        instrumentations[key] = function(this: unknown[], ...args: unknown[]) {
            // todo：阻止track
            // 执行对数组的操作，获取返回值
            const res = (toRaw(this) as any)[key].apply(this, args)
            // todo: 重置track
            return res
        }
    })
    return instrumentations
}

// 产出包含几个数组函数处理逻辑的对象
const arrayInstrumentations = createArrayInstrumentations();

// 对get捕获器进行封装，通过外部参数控制内部不同行为
function createGetter(isReadonly = false, shallow = false) {
    return function get(target: Target, key: string | symbol, receiver: object) {
        // 处理key为ReactiveFlags中属性的情况
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        } else if (key === ReactiveFlags.IS_SHALLOW) {
            return shallow
        } else if(key === ReactiveFlags.RAW) { // 条件未写完
            return target
        }
        // 处理数组类型
        const targetIsArray = isArray(target)
        if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
            // 对数组中的几个方法走封装的处理对象获取数据
            return Reflect.get(arrayInstrumentations, key, receiver)
        }

        // 通过反射方法获取结果值
        const res = Reflect.get(target, key, receiver)

        // 对内置的符号类型属性不进行track直接返回结果值
        if(isSymbl(key) && builtInSymbols.has(key)) {
            return res
        }
        // 如果不是只可读，就需要进行依赖收集
        if (!isReadonly) {
            // todo track实现
        }
        // 如果shallow为true表示只为目标对象的最外层数据做一层代理 
        if (shallow) {
            return res
        }
        // todo: 判断待返回值是否是ref类型

        // 若是待返回值是个对象，也给待返回值做一层代理
        if (isObject(res)) {
            if (isReadonly) {
                // todo: readonly(res)
            } else {
                return reactive(res)
            }
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



