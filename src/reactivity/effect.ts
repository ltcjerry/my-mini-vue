import { extend, isArray } from "../shared"
import { createDep, Dep } from "./dep"
import { TrackOpTypes, TriggerOpTypes } from "./operations"

// 不考虑环境变量
export const ITERATE_KEY = Symbol('')
export const MAP_KEY_ITERATE_KEY = Symbol('')

// 记录当前正在执行的effect对象
export let activeEffect: ReactiveEffect | undefined

export type EffectScheduler = (...args: any[]) => any

// 清理依赖项中包含的effect
function cleanupEffect(effect: ReactiveEffect) {
    const { deps } = effect;
    if (deps.length) {
        for(let i = 0; i < deps.length; i++) {
            deps[i].delete(effect)
        }
        deps.length = 0
    }
}

export class ReactiveEffect<T = any> {
    active = true
    deps: Dep[] = []
    parent: ReactiveEffect | undefined = undefined
    computed?: any // todo: 暂不实现，用any替代
    allowRecurse?: boolean
    onStop?: () => void
    constructor(
        public fn: () => T, 
        public scheduler: EffectScheduler | null = null,
        scope?: any // todo: 暂不实现，用any替代
    ) {
        // recordEffectScope(this, scope) 暂不实现
    }
    // 执行传入的effect函数，并标记是否需要依赖收集
    run() {
        // 不需要依赖收集，直接执行
        if (!this.active) {
            return this.fn();
        }
        let parent: ReactiveEffect | undefined = activeEffect
        let lastShouldTrack = shouldTrack
        // 感觉这是再找最外层的effect
        while(parent) {
            if (parent === this) {
                return
            }
            parent = parent.parent
        }
        try {
            this.parent = activeEffect
            activeEffect = this
            // 打开依赖收集标志
            shouldTrack = true
            return this.fn()
        } finally {
            activeEffect = this.parent
            shouldTrack = lastShouldTrack
            this.parent = undefined
        }
    }

    stop() {
        if (this.active) {
            cleanupEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}

export interface ReactiveEffectOptions {
    lazy?: boolean,
    scheduler?: any,
    scope?: any,
    allowRecure?: any,
    onStop?: () => void
}

export interface ReactiveEffectRunner<T = any> {
    (): T
    effect: any
}
// 封装传入的fn，执行这个fn，并返回封装对象的执行函数给用户使用
export function effect<T = any>(
    fn: () => T, 
    options?: ReactiveEffectOptions
): ReactiveEffectRunner {
    if ((fn as ReactiveEffectRunner).effect) {
        fn = (fn as ReactiveEffectRunner).effect.fn
    }
    // 将副作用函数封装成一个对象并添加控制属性
    const _effect = new ReactiveEffect(fn)
    if (options) {
        extend(_effect, options)
        // 暂不实现effect域
    }
    if (!options || !options.lazy) {
        _effect.run()
    }
    const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
    runner.effect = _effect
    return runner
}

// 全局的依赖映射仓库
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

// 响应时核心方法依赖收集
export function track(target: object, type: TrackOpTypes, key: unknown) {
    if (shouldTrack && activeEffect) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }
        let dep = depsMap.get(key)
        if (!dep) {
            depsMap.set(key, (dep = createDep()))
        }
        // 上面先获取key对应的依赖集
        trackEffects(dep)
    }
}
// 收集依赖，其实就是把当前正在执行的封装对象activeEffect加入对应依赖集合
export function trackEffects(dep: Dep) {
    let shouldTrack = true // 默认每次都可以收集，源码有判断
    if (shouldTrack) {
        dep.add(activeEffect!)
        // todo: 这里不是很懂
        activeEffect!.deps.push(dep)
    }

}

// 响应时核心方法依赖触发，先获取依赖项再触发
export function trigger(
    target: object,
    type: TriggerOpTypes,
    key?: unknown,
    newValue?: unknown,
    oldvalue?: unknown,
    oldtarget?: Map<unknown, unknown> | Set<unknown>
) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return false

    let deps: (Dep | undefined)[] = []

    if (type === TriggerOpTypes.CLEAR) { // 集合
        deps = [...depsMap.values()]
    } else if(key === 'length' && isArray(target)) { // 数组
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= (newValue as number)) {
                deps.push(dep)
            }
        })
    } else {
        if (key !== void 0) {
            deps.push(depsMap.get(key))
        }
        // 还有对其它type的处理暂时忽略
    }

    if(deps.length === 1) {
        if (deps[0]) {
            triggerEffects(deps[0])
        }
    } else {
        const effects: ReactiveEffect[] = []
        for(const dep of deps) {
            if (dep) {
                effects.push(...dep)
            }
        }
        triggerEffects(effects)
    }
}
// 挨个执行依赖队列的每一项
export function triggerEffects(dep: Dep | ReactiveEffect[]) {
    for(const effect of isArray(dep) ? dep : [...dep]) {
        if (effect !== activeEffect || effect.allowRecurse) {
            if (effect.scheduler) {
                effect.scheduler()
            } else {
                effect.run()
            }
        }
    }
}

// 声明一个全局的打开依赖收集标志
export let shouldTrack = true