import { isObject, toRawType } from "../shared"
import { mutableHandlers } from "./baseHandlers"
import { mutableCollectionHandlers } from "./collectionHandlers"

export const enum ReactiveFlags {
    SKIP = '__v_skip',
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
    IS_SHALLOW = '__v_isShallow',
    RAW = '__V_raw'
}

export interface Target {
    [ReactiveFlags.SKIP]?: boolean,
    [ReactiveFlags.IS_REACTIVE]?: boolean,
    [ReactiveFlags.IS_READONLY]?: boolean,
    [ReactiveFlags.IS_SHALLOW]?: boolean,
    [ReactiveFlags.RAW]?: any
}

const enum TargetType {
    INVALID = 0,
    COMMON = 1,
    COLLECTION = 2
}

function targetTypeMap(rawType: string) {
    switch(rawType) {
        case 'Object':
        case 'Array':
            return TargetType.COMMON
        case 'Map':
        case 'Set':
        case 'WeakMap':
        case 'WeakSet':
        return TargetType.COLLECTION
        default:
            return TargetType.INVALID
    }
}

function getTargetType(value: Target) {
    return (value[ReactiveFlags.SKIP] || !Object.isExtensible(value))
    ? 
    TargetType.INVALID
    :
    targetTypeMap(toRawType(value))
}

export const reactiveMap = new WeakMap<Target, any>()
export const shallowReactiveMap = new WeakMap<Target, any>()
export const readonlyMap = new WeakMap<Target, any>()
export const shallowReadonlyMap = new WeakMap<Target, any>()

function createReactiveObject(
    target: Target,
    isReadonly: boolean,
    baseHandlers: ProxyHandler<any>,
    collectionHandlers: ProxyHandler<any>,
    proxyMap: WeakMap<Target, any>
) {
    // 已经是代理对象直接返回
    if (target[ReactiveFlags.RAW] && !(isReadonly && target[ReactiveFlags.IS_REACTIVE])) {
        return target
    }
    // 已经做过代理的对象直接返回代理对象
    const existingProxy = proxyMap.get(target)
    if (existingProxy) {
        return existingProxy
    }
    // 无效的数据类型直接返回，不再做代理
    const targetType = getTargetType(target)
    if (targetType === TargetType.INVALID) {
        return target
    }
    // 根据不同数据类型建立代理并存取映射关系
    const proxy = new Proxy(
        target, 
        targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
    )
    proxyMap.set(target, proxy)
    return proxy
}


export function reactive(target: object) {
    return createReactiveObject(
        target, 
        false, 
        mutableHandlers, 
        mutableCollectionHandlers,
        reactiveMap
    )
}

// 辅助函数
export function isReadonly(value: unknown): boolean {
    return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

export function isReactive(value: unknown): boolean {
    if (isReadonly(value)) {
        return isReactive((value as Target)[ReactiveFlags.RAW])
    } else {
        return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
    }
}

export function toRaw<T>(observed: T): T {
    const raw = observed && (observed as Target)[ReactiveFlags.RAW]
    return raw ? toRaw(raw) : observed
}

export function toReactive<T extends object>(value: T): T {
    return isObject(value) ? reactive(value) : value
}