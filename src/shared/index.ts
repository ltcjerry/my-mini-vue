// 获取数据类型
export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)
// 作用如从'[object String]'字符串中截取到类型String字符串
export const toRawType = (value: unknown): string => toTypeString(value).slice(8, -1)

// 判断对象上是否有某个属性
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (value: object, key: string | symbol): key is keyof typeof value => hasOwnProperty.call(value, key)
// 判断是否是数组类型
export const isArray = Array.isArray
// 判断是否是对象类型
export const isObject = (value: unknown): value is Record<any, any> => value !== null && typeof value === 'object'
// 判断是不是符号类型
export const isSymbl = (value: unknown): value is symbol => typeof value === 'symbol'
// 判断两个值是否发生改变
export const hasChanged = (value: unknown, oldValue: unknown): boolean => !Object.is(value, oldValue)

// 合并两个对象
export const extend = Object.assign

export const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
    const cache: Record<string, string> = Object.create(null)
    return ((str: string) => {
        const hit = cache[str]
        return hit || (cache[str] = fn(str))
    }) as any
}

export const capitalize = cacheStringFunction((str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
})

export const toHandlerKey = cacheStringFunction((str: string) => {
    return str ? `on${capitalize(str)}` : ''
})

export const isFunction = (val: unknown): val is Function => typeof val === 'function'