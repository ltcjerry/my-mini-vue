import { isArray, isObject } from "shared"
import { createVNode, isVNode } from "./vnode"

export function h(type: any, propsOrChildren?: any, children?: any) {
    const len = arguments.length
    if (len === 2) {
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
            if (isVNode(propsOrChildren)) {
                return createVNode(type, null, [propsOrChildren])
            }
            return createVNode(type, propsOrChildren)
        } else {
            return createVNode(type, null, propsOrChildren)
        }
    } else {
        if (len > 3) {
            children = Array.prototype.slice.call(arguments, 2)
        } else if (len === 3 && isVNode(children)) {
            children = [children]
        }
        return createVNode(type, propsOrChildren)
    }
}