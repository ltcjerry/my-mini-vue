
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

export class ReactiveEffect<T = any> {
    active = true
}

// export function effect<T = any>(
//     fn: () => T, 
//     options?: ReactiveEffectOptions
// ): ReactiveEffectRunner {

// }