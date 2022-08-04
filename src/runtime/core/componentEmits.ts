import { toHandlerKey } from "shared"

export function emit(
    instance: any,
    event: string,
    ...rawArgs: any[]
) {
    if (instance.isUnmounted) return
    const props = instance.vnode.props || {}
    let args = rawArgs
    const isModelListener = event.startsWith('update:')
    const modelArg = isModelListener && event.slice(7)
    if (modelArg && modelArg in props) {
        // 根据修饰符处理发布所带的参数args
    }
    let handlerName
    let handler = props[(handlerName = toHandlerKey(event))]
    const onceHandler = props[handlerName + 'Once']
    if (onceHandler) {
        if (!instance.emitted) {
            instance.emitted = {} as Record<any, boolean>
        } else if (instance.emitted[handlerName]) {
            return ''
        }
        instance.emitted[handlerName] = true
    }
}