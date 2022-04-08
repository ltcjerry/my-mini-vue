import { hasChanged } from "../shared"
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
    // if (shouldTrack && activeEffect) {
    //     ref = toRaw(ref)
    //     trackEffects(ref.dep || (ref.dep = createDep()))
    // }
}

export function triggerRefValue(ref: RefBase<any>) {
    ref = toRaw(ref)
    // if (ref.dep) {
    //     triggerEffects(ref.dep)
    // }
}

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

export function ref(value?: unknown) {
    return createRef(value, false)
}


// 辅助函数
export function isRef<T>(v: Ref<T> | unknown): v is Ref<T>
export function isRef(v: any): v is Ref {
    return !!(v && v.__v_isRef === true)
}