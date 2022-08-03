import { PatchFlags } from "shared/patchFlags";
import { ShapeFlags } from "shared/shapeFlags";

export const Fragment = Symbol('Fragment') as any as {
    __isFragment: true
    new (): {
        $props: any
    }
}

function createBaseVNode(
    type: any,
    props: any,
    children: unknown = null,
    patchFlag = 0,
    dynamicProps: string[] | null = null,
    shapeFlag = type === Fragment ? 0: ShapeFlags.ELEMENT,
    isBlockNode = false,
    needFullChildrenNoralization = false
) {
    const vnode = {
        __v_isVNode: true,
        __v_skip: true,
        type,
        props,
        key: props && props?.key || null,
        ref: props && props.ref || null,
        scopeId: null,
        slotScopeIds: null,
        children,
        component: null,
        suspense: null,
        dirs: null,
        transition: null,
        el: null,
        shapeFlag,
        patchFlag,
        dynamicProps
    }

    if (needFullChildrenNoralization) {
        // normalizeChildren
        if (shapeFlag & ShapeFlags.SUSPENSE) {
            // normalize
        }
    } else if (children) {
        vnode.shapeFlag |= typeof children === 'string' 
            ? ShapeFlags.TEXT_CHILDREN
            : ShapeFlags.ARRAY_CHILDREN
    }

    // track vnode for block tree
    return vnode
}

export { createBaseVNode as createElementVNode }
// 开发环境有所不同
export const createVNode = (_createVNode) as typeof _createVNode

export function isVNode(value: any) {
    return value ? value.__v_isVNode === true : false
}
function _createVNode(
    type: any,
    props: any,
    children: unknown = null,
    patchFlag: number = 0,
    dynamicProps: string[] | null = null,
    isBlockNode = false
) {

    if (isVNode(type)) {
        // 拷贝VNode
        const cloned = {patchFlag: 0}
        if (children) {
            // 处理children
        }
        if (!isBlockNode) {
            // 块处理
        }
        cloned.patchFlag |= PatchFlags.BAIL
        return cloned
    }
    // class component
    if (typeof type === 'function' && '__vccOpts' in type) {
        type = type?.__vccOpts
    }
    if (props) {
        // class和styole normalize
    }
    const shapeFlag = typeof type === 'string'
        ? ShapeFlags.ELEMENT
        : type.__isSuspense
        ? ShapeFlags.SUSPENSE
        : type.__isTeleport
        ? ShapeFlags.TELEPORT
        : type !== null && typeof type === 'object'
        ? ShapeFlags.STATEFUL_COMPONENT
        : typeof type === 'function'
        ? ShapeFlags.FUNCTION_COMPONENT
        : 0
    return createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        isBlockNode,
        true
    )
}