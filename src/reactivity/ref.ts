import { hasChanged } from "../shared"
import { createDep } from "./dep"
import { activeEffect, shouldTrack, trackEffects, triggerEffects } from "./effect"
import { toRaw, toReactive } from "./reactive"

declare const RefSymbol: unique symbol

export interface Ref<T = any> {
    value: T,
    [RefSymbol]: true
}

type RefBase<T> = {
    dep?: any,
    value: T
}

export function trackRefValue(ref: RefBase<any>) {
    if (shouldTrack && activeEffect) {
        ref = toRaw(ref)
        trackEffects(ref.dep || (ref.dep = createDep()))
    }
}

export function triggerRefValue(ref: RefBase<any>) {
    ref = toRaw(ref)
    if (ref.dep) {
        triggerEffects(ref.dep)
    }
}

// ref实现类
class RefImpl<T> {
    private _value: T
    private _rawValue: T
    public dep?: any
    public readonly __v_isRef = true
    constructor(value: T, public readonly __v_isShallow: boolean) {
        this._rawValue = __v_isShallow ? value : toRaw(value)
        this._value = __v_isShallow ? value : toReactive(value)
    }
    get value() {
        trackRefValue(this)
        return this._value
    }
    set value(newVal) {
        newVal = this.__v_isShallow ? newVal : toRaw(newVal)
        if (hasChanged(newVal, this._rawValue)) {
            this._rawValue = newVal
            this._value = this.__v_isShallow ? newVal : toReactive(newVal)
            triggerRefValue(this)
        }
    }
}

function createRef(rawValue: unknown, shallow: false) {
    return isRef(rawValue) ? rawValue : new RefImpl(rawValue, shallow)
}
export function ref<T extends object>(value: T): [T] extends [Ref] ? T : any
export function ref<T>(value: T): Ref<T>
export function ref< T = any>(): Ref<T | undefined>
export function ref(value?: unknown) {
    return createRef(value, false)
}
// 自定义ref工厂函数类型
export type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
) => {
    get: () => T,
    set: (value: T) => void
}

class CustomRefImpl<T> {
    public dep?: any
    private readonly _get: ReturnType<CustomRefFactory<T>>['get']
    private readonly _set: ReturnType<CustomRefFactory<T>>['set']
    public readonly __v_isRef = true
    constructor(factory: CustomRefFactory<T>) {
        const { get, set } = factory(
            () => trackRefValue(this),
            () => triggerRefValue(this)
        )
        this._get = get
        this._set = set
    }
    get value() {
        return this._get()
    }
    set value(newVal) {
        this._set(newVal)
    }
}

export function customRef<T>(factory: CustomRefFactory<T>): Ref<T> {
    return new CustomRefImpl(factory) as any
}


// 辅助函数
export function isRef<T>(v: Ref<T> | unknown): v is Ref<T>
export function isRef(v: any): v is Ref {
    return !!(v && v.__v_isRef === true)
}