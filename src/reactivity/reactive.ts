import { track, trigger } from "./effect";

export function reactive(raw: {[key:string]: any}) {
    return new Proxy(raw, {
        // 捕获器
        get(target, key) {
           const res = Reflect.get(target, key);
           // track（依赖收集）
           track(target, key);
           return res;
        },
        set(target, key, value) {
            const res = Reflect.set(target, key, value);
            // trigger(触发依赖)
            trigger(target, key);
            return res;
        }
    })
}