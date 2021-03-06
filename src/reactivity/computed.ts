import { Dep } from "./dep"
import { ReactiveEffect, track } from "./effect"
import { ReactiveFlags, toRaw } from "./reactive"
import { trackRefValue, triggerRefValue } from "./ref"

declare const ComputedRefSymbol: unique symbol

export interface ComputedRef<T = any> extends WritableComputedRef<T> {
    readonly value: T
    [ComputedRefSymbol]: true
}

export interface WritableComputedRef<T> {
    value: T
    readonly effect: ReactiveEffect<T>
}

export type ComputedGetter<T> = (...arg: any[]) => T
export type ComputedSetter<T> = (v: T) => void

export interface WritableComputedOptions<T> {
    get: ComputedGetter<T>,
    set: ComputedSetter<T>
}

export class ComputedRefImpl<T> {
    public dep?: Dep = undefined
    private _value!: T
    public readonly effect: ReactiveEffect<T>
    public readonly __v_isRef = true
    public readonly [ReactiveFlags.IS_READONLY]: boolean = false
    public _dirty = true
    public _cacheable: boolean
    constructor(
        getter: ComputedGetter<T>,
        private readonly _setter: ComputedSetter<T>,
        isReadonly: boolean,
        isSSR: boolean
    ) {
        this.effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true
                triggerRefValue(this)
            }
        })
        this.effect.computed = this
        this.effect.active = this._cacheable = !isSSR
        this[ReactiveFlags.IS_READONLY] = isReadonly
    }
    get value() {
        const self = toRaw(this)
        trackRefValue(self)
        if (self._dirty || !self._cacheable) {
            self._dirty = false
            self._value = self.effect.run()!
        }
        return self._value
    }
    set value(newValue: T) {
        this._setter(newValue)
    }
}

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>
export function computed<T>(options: WritableComputedOptions<T>): WritableComputedRef<T>
export function computed<T>(
    getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
    let getter: ComputedGetter<T>
    let setter: ComputedSetter<T>
    const onlyGetter = typeof getterOrOptions === 'function'
    if (onlyGetter) {
        getter = getterOrOptions
        setter = () => {}
    } else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, false)
    return cRef as any
}