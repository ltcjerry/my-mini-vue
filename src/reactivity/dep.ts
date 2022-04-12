import { ReactiveEffect } from "./effect";

// 依赖队列，忽略依赖次数标记属性(w,n)
export type Dep = Set<ReactiveEffect>

export const createDep = (effects?: ReactiveEffect[]): Dep => {
    const dep = new Set<ReactiveEffect>(effects) as Dep
    return dep
}