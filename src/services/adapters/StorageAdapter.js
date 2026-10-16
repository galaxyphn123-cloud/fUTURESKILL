/* StorageAdapter interface (contract every adapter implements):
   put(collection, record)         -> saved record (with id/timestamps)
   get(collection, id)             -> record | null
   list(collection, filterFn?)     -> record[]
   remove(collection, id)          -> void
   Every adapter is collection-based and keyed by stable record.id,
   matching the shape a future relational schema would use. */
