import { Dep } from "./dep"
import { ReactiveEffect, track } from "./effect"
import { ReactiveFlags, toRaw } from "./reactive"
import { trackRefValue, triggerRefValue } from "./ref"

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