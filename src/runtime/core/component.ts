import { createAppContext } from "./apiCreateApp";
import { emit } from "./componentEmits";

export const enum LifecycleHooks {
    BEFORE_CREATE = 'bc',
    CREATED = 'c',
    BEFORE_MOUNT = 'bm',
    MOUNTED = 'm',
    BEFORE_UPDATE = 'bu',
    UPDATED = 'u',
    BEFORE_UNMOUNT = 'bum',
    UNMOUNTED = 'um',
    DEACTIVATED = 'da',
    ACTIVATED  = 'a',
    RENDER_TRACKED = 'rtc',
    RENDER_TRIGGERED = 'rtg',
    ERROR_CAPTURED = 'ec',
    SERVER_PREFETCH = 'sp'
}

const emptyAppContext = createAppContext()

let uid = 0

export function createComponentInstance(
    vnode: any,
    parent: any,
    suspense: any
) {
    const type = vnode.type
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext
    const instance = {
        uid: uid++,
        vnode,
        type,
        parent,
        root: null,
        subTree: null!,
        effect: null!,
        update: null!,
        render: null,
        exposed: null,
        provides: parent ? parent.provides : Object.create(appContext.provides),
        components: null,
        directives: null,
        propsOptions: null!, // normalizePropsOptions(type, appContext)
        emitsOPtions: null!, // normalizeEmitsOptions(type, appContext)
        emit: null,
        emitted: null,
        propsDefaults: {},
        inheritAttrs: type.inheritAttrs,
        // state
        ctx: {},
        data: {},
        props: {},
        attrs: {},
        slots: {},
        refs: {},
        setupState: {},
        setupContext: null,
        // suspense
        suspense,
        suspenseId: suspense ? suspense.pendingId : 0,
        asyncDep: null,
        asyncResolved: false,
        // lifecycle hooks
        isMounted: false,
        isUnmounted: false,
        isDeactivated: false,
        bc: null,
        c: null,
        bm: null,
        m: null,
        bu: null,
        u: null,
        um: null,
        bum: null,
        da: null,
        a: null,
        rtg: null,
        rtc: null,
        ec: null,
        sp: null
    }
    instance.ctx = {_: instance}
    instance.root = parent ? parent.root : instance
    instance.emit = emit.bind(null, instance) as any
    if (vnode.ce) {
        vnode.ce
    }
    return instance
}

export let currentInstance: any = null
export const getCurrentInstance = () => currentInstance || 'currentRenderingInstance'