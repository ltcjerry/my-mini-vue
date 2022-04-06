// 获取数据类型
export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)
// 作用如从'[object String]'字符串中截取到类型String字符串
export const toRawType = (value: unknown): string => toTypeString(value).slice(8, -1)

// 判断是不是符号类型
export const isSymbl = (value: unknown): value is symbol => typeof value === 'symbol'


const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (value: object, key: string | symbol): key is keyof typeof value => hasOwnProperty.call(value, key)