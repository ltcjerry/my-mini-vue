/**
 * @description 监听对象为集合类型的捕获器方法
 * @author jerry
 */

import { hasChanged, hasOwn } from "../shared"
import { ITERATE_KEY, track, trigger } from "./effect"
import { TrackOpTypes, TriggerOpTypes } from "./operations"
import { ReactiveFlags, toRaw, toReactive } from "./reactive"

type IterableCollections = Map<any, any> | Set<any>
type WeakCollections = WeakMap<any, any> | WeakSet<any>
type MapTypes = Map<any, any> | WeakMap<any, any>
type SetTypes = Set<any> | WeakSet<any>

export type CollectionTypes = IterableCollections | WeakCollections

// Map集合类型get方法
function get(target: MapTypes, key: unknown, isReadonly = false, isShallow = false) {
    target = (target as any)[ReactiveFlags.RAW]
    const rawTarget = toRaw(target)
    const rawKey = toRaw(key)
    if (key !== rawKey) {
        !isReadonly && track(rawTarget, TrackOpTypes.GET, key)
    } else {
       !isReadonly && track(rawTarget, TrackOpTypes.GET, rawKey) 
    }
    // 其他情况先不考虑，若待返回结果值为Object类型则为其添加代理
    return toReactive(target.get(key)) || toReactive(target.get(rawKey))
}
// 集合has方法
function has(this: CollectionTypes, key: unknown, isReadonly = false): boolean {
    const target = (this as any)[ReactiveFlags.RAW]
    const rawTarget = toRaw(target)
    const rawKey = toRaw(key)
    if (key !== rawKey) {
        !isReadonly && track(rawTarget, TrackOpTypes.HAS, key)
    } else {
        !isReadonly && track(rawTarget, TrackOpTypes.HAS, rawKey)
    }
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey)
}
// 强集合类型size方法
function size(target: IterableCollections, isReadonly = false) {
    target = (target as any)[ReactiveFlags.RAW]
    !isReadonly && track(toRaw(target), TrackOpTypes.ITERATE, ITERATE_KEY)
    return Reflect.get(target, 'size', target)
}
// Set类型add方法
function add(this: SetTypes, value: unknown) {
    value = toRaw(value)
    const target = toRaw(this)
    // todo：需先判断集合中有没有这个值,先假设没有
    if (true) {
        target.add(value)
        trigger(target, TriggerOpTypes.ADD, value, value)
    }
    return this
}
// Map类型set方法
function set(this: MapTypes, key: unknown, value: unknown) {
    value = toRaw(value)
    const target = toRaw(this)
    target.set(key, value)
    // 假设key值存在
    const hadKey = true
    // 暂不考虑新旧值不同情况
    const oldValue = ''
    if (hadKey) {
        trigger(target, TriggerOpTypes.ADD, key, value)
    } else if (hasChanged(value, oldValue)) { 
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
    }
    return this
}
// 集合类型delete方法
function deleteEntry(this: CollectionTypes, key: unknown) {
    const target = toRaw(this)
    const res = target.delete(key)
    // 假设key值存在
    const hadKey = true
    const oldValue = undefined
    if (hadKey) {
        trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
    }
    return res
}
// 强集合类型clear方法
function clear(this: IterableCollections) {
    const target = toRaw(this)
    const hadItems  = target.size !== 0
    const res = target.clear()
    if (hadItems) {
        trigger(target, TriggerOpTypes.CLEAR, undefined, undefined, undefined)
    }
    return res
}
// 强类型迭代方法
function createForEach(isReadonly: boolean, isShallow: boolean) {
    return function forEach(this: IterableCollections, callback: Function, thisArg?: unknown) {
        const observed = this as any
        const target = observed[ReactiveFlags.RAW]
        const rawTarget = toRaw(target)
        !isReadonly && track(rawTarget, TrackOpTypes.ITERATE, ITERATE_KEY)
        return target.forEach((value: unknown, key: unknown) => {
            return callback.call(thisArg, value, key, observed)
        })
    }
}
// 重写了常用的几个会触发捕获器的集合方法
function createInstrumentations() {
    const mutableInstrumentations: Record<string, Function> = {
        get(this: MapTypes, key: unknown) {
            return get(this, key)
        },
        get size() {
            return size(this as unknown as IterableCollections)
        },
        has,
        add,
        set,
        delete: deleteEntry,
        clear,
        forEach: createForEach(false, false)
    }
    // 其他情况的捕获器方法暂不考虑
    return [mutableInstrumentations]
}

const [mutableInstrumentations] = createInstrumentations()
// 集合类型的所有方法触发捕获器的入口位置，显然只能通过get捕获器，与普通的对象类型区别较大
function createInstrumentationGetter(isReadonly: boolean, isShallow: boolean) {
    const instrumentations = mutableInstrumentations
    return (target: CollectionTypes, key: string | symbol, receiver: CollectionTypes) => {
        // 跟普通对象一样处理内部几个属性
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        } else if (key === ReactiveFlags.RAW) {
            return target
        }
        const temp = hasOwn(instrumentations, key) && key in target ? instrumentations : target
        return Reflect.get(temp, key, receiver)
    }
}
// 目前只考虑普通的代理情况，只可读或浅代理暂不考虑
export const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {
    get: createInstrumentationGetter(false, false)
}