import { isFunction } from "shared"
import { createVNode } from "./vnode"

export function createAppContext(): any {
    return {
        app: null as any,
        config: {
            isNativeTag: () => false,
            performance: false,
            globalProperties: {},
            optionMergeStrategies: {},
            errorHandler: undefined,
            warnHandler: undefined,
            compilerOptions: {}
        },
        mixins: [],
        components: {},
        directives: {},
        provides: Object.create(null),
        optionsCache: new WeakMap(),
        propsCache: new WeakMap(),
        emitsCache: new WeakMap()
    }
}

let uid = 0

export function createAppAPI<HostElement>(
    render: any,
    hydrate?: any
) {
    return function createApp(rootComponent:any, rootProps = null) {
        if (!isFunction(rootComponent)){
            rootComponent = { ...rootComponent }
        }

        const context = createAppContext()
        const installedPlugins = new Set()
        let isMounted = false

        const app: any = (context.app = {
            _uid: uid++,
            _component: rootComponent,
            _props: rootProps,
            _container: null,
            _context: context,
            _instance: null,
            version: '',
            get config() {
                return context.config
            },
            use(plugin: any, ...options: any[]) {
                if (installedPlugins.has(plugin)) {
                    // dev warning
                } else if (plugin && isFunction(plugin.install)) {
                    installedPlugins.add(plugin)
                    plugin.install(app, ...options)
                } else if (isFunction(plugin)) {
                    installedPlugins.add(plugin)
                    plugin(app, ...options)
                }
                return app
            },
            mixin(mixin: any) {
                if (!context.mixins.includes(mixin)) {
                    context.mixins.push(mixin)
                }
                return app
            },
            component(name: string, component?: any) {
                if (!component) {
                    return context.components[name]
                }
                context.components[name] = component
                return app
            },
            directive(name: string, directive?: any) {
                if (!directive) {
                    return context.directives[name]
                }
                context.directives[name] = directive
                return app
            },
            mount(
                rootContainer: HostElement,
                isHydrate?: boolean,
                isSVG?: boolean
            ) {
                if (!isMounted) {
                    const vnode = createVNode(rootComponent, rootProps)
                    vnode.appContext = context
                    render(vnode, rootContainer, isSVG)
                    isMounted = true
                    app._container = rootContainer
                    return 'getExposeProxy()'
                }
            },
            unmount() {
                if(isMounted) {
                    render(null, app._container)
                    delete app._container.__vue_app__
                }
            },
            provide(key: any, value: any) {
                context.provides[key as string | symbol] = value
                return app
            }
        })

        return app
    }
}