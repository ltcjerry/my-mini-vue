import { ShapeFlags } from "shared/shapeFlags"
import { createAppAPI } from "./apiCreateApp"

export type RootRenderFunction<HostElement = RendererElement> = (
    Vnode: any | null,
    container: HostElement,
    isSvg?: boolean
) => void

export interface RendererNode {
    [key: string]: any
}

export interface RendererElement extends RendererNode {}

export interface RendererOptions< HostNode = RendererNode, HostElement = RendererElement> {
    patchProp(
        el: HostElement,
        key: string,
        preValue: any,
        nextValue: any,
        isSVG?: boolean,
        prevChildren?: any,
        parentComponent?: any,
        parentSuspense?: any,
        unmountChildren?: any
    ): void,
    insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void,
    remove(el: HostNode): void,
    createElement(
        type: string,
        isSVG?: boolean,
        isCustomizeBuiltIn?: string,
        vnodeProps?: ({ [key: string]: any }) | null
    ): HostElement,
    createText(text: string): HostNode,
    createComment(text: string): HostNode,
    setText(node: HostNode, text: string): void,
    setElementText(node: HostElement, text: string): void,
    parentNode(node: HostNode): HostElement | null,
    nextSibling(node: HostNode): HostNode | null,
    querySelector?(selector: string): HostElement | null,
    setScopeId?(el: HostElement, id: string): void,
    cloneNode?(node: HostNode): HostNode,
    insertStaticContent?(
        content: string,
        parent: HostElement,
        anchor: HostNode | null,
        isSVG: boolean,
        start?: HostNode | null,
        end?: HostNode | null
    ): [HostNode, HostNode]
}
function baseCreateRenderer(options: RendererOptions): any {
    const {
        insert: hostInsert,
        remove: hostRemove,
        patchProp: hostPatchProp,
        createElement: hostCreateElement,
        createText: hostCreateText,
        createComment: hostCreateComment,
        setText: hostSetText,
        setElementText: hostSetElementText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        setScopeId: hostSetScopeId = () => {},
        cloneNode: hostCloneNode,
        insertStaticContent: hostInsetStaticContent
    } = options

    const patch = () => {}

    const processText = () => {}

    const processCommentNode = () => {}

    const mountStaticNode = () => {}

    const patchStaticNode = () => {}

    const moveStaticNode = () => {}

    const removeStaticNode = () => {}

    const processElement = () => {}

    const mountElement = () => {}

    const setScopeid = () => {}

    const mountChildren = () => {}

    const patchElement = () => {}

    const patchBlockChildren = () => {}

    const patchProps = () => {}

    const processFragment = () => {}

    const processComponent = () => {}

    const mountComponent = () => {}

    const updateComponent = () => {}

    const setupRenderEffect = () => {}

    const updateComponentPreRender = () => {}

    const patchChildren = () => {}

    const patchUnkeyedChildren = () => {}

    const patchKeyedChildren = () => {}

    const move = () => {}

    const unmount = (
        vnode: any,
        parentComponent: any,
        parentSuspense: any,
        doRemove = false,
        optimized = false
    ) => {
        const {
            type,
            props,
            ref,
            children,
            dynamicChildren,
            shapeFlag,
            patchFlag,
            dirs
        } = vnode
        if (ref != null) {

        }
        if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
            parentComponent.ctx.deactivate(vnode)
            return undefined
        }
        const shouldInvokeDirs = shapeFlag & ShapeFlags.ELEMENT && dirs
        const shouldInvokeVnodeHook = !!(vnode.type.__asyncLoader)
        let vnodeHook
        if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {}
    }

    const remove = () => {}

    const removeFragment = () => {}

    const unmountComponent = () => {}

    const unmountChildren = () => {}

    const getNextHostNode = (vnode: any) => {

    }

    const render: RootRenderFunction = (vnode, container, isSVG) => {
        if (vnode == null) {
            // 卸载
            if (container._vnode) {
                unmount(container._vnode, null, null, true)
            }
        } else {
            // patch(container._vnode || null, vnode, container, null, null, isSVG)
        }
        // flushPostFlushCbs()
        container._vnode = vnode
    }
    let hydrate

    return {
        render,
        createApp: createAppAPI(render, hydrate)
    }
}