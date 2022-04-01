/**
 * @description 监听对象为集合类型的捕获器方法
 * @author jerry
 */

type IterableCollections = Map<any, any> | Set<any>
type WeakCollections = WeakMap<any, any> | WeakSet<any>
type MapTypes = Map<any, any> | WeakMap<any, any>
type SetTypes = Set<any> | WeakSet<any>

export type CollectionTypes = IterableCollections | WeakCollections

export const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {
    get() {}
}