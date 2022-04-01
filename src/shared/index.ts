export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)
// 作用如从'[object String]'字符串中截取到类型String字符串
export const toRawType = (value: unknown): string => toTypeString(value).slice(8, -1)

