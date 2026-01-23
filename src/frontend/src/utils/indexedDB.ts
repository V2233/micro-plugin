// /**
//  * 示例
// openDB('todo').then((db)=>{
//     console.log(db)
//     let data = {
//         uuid: 1232322,
//         name: 'asd as'
//     }
//     addData(db, 'users', data)

//     getDataByKey(db, 'users', 128)

//     cursorGetData(db,'users')

//     getDataByIndex(db, 'users', 'age', 4)
// })
//  */

// /**
//  * @params dbName 数据库名
//  * @params version 数据库版本
//  * @returns
//  */
// export function openDB(dbName, version = 1) {
//     return new Promise((resolve,reject) => {
//         let indexedDB = window.indexedDB || window.mozIndexdDB || window.webkitIndexedDB || window.msIndexedDB

//         let db;
//         // 若没有则创建
//         const request = indexedDB.open(dbName,version)

//         request.onsuccess = function(event) {
//             db = event.target.result;
//             console.log('数据库打开')
//             resolve(db)
//         }

//         request.onerror = function(event) {
//             console.log('indexdDB打开失败')
//             console.log(event)
//         }

//         request.onupgradeneeded = function(event) {
//             console.log('indexdDB创建或升级')
//             db = event.target.result;
//             let objectStore;
//             // 创建存储库
//             objectStore = db.createObjectStore("sandbox",{
//                 keyPath: "onebot11", // 主键
//                 autoIncrement: true // 自增
//             })

//             objectStore.createIndex("link","link",{unique: false})
//             objectStore.createIndex("sequenceId","sequenceId",{unique: false})
//             objectStore.createIndex("messageType","messageType",{unique: false})
//         }
//     })
// }

// /**
//  * @params db 数据库实例
//  * @params storeName 仓库名称
//  * @params data 数据
//  */
// export function addData(db, storeName, data) {
//     let request = db
//     .transaction([storeName],"readwrite")
//     .objectStore(storeName)
//     .add(data);

//     request.onsuccess = function(event) {
//         console.log('数据成功添加到数据库!')
//     }

//     request.onerror = function(event) {
//         console.log('indexdDB写入失败')
//         console.log(event)
//     }
// }

// /**
//  * 按键查找
//  * @params db 数据库实例
//  * @params storeName 仓库名称
//  * @params key 查找的键
//  * @returns
//  */
// export function getDataByKey(db, storeName, key) {
//     let transaction = db.transaction([storeName]) //事务
//     let objectStore = transaction.objectStore(storeName) //仓库对象
//     let request = objectStore.get(key)

//     request.onerror = function(event) {
//         console.log('事务失败')
//         console.log(event)
//     }

//     request.onsuccess = function(event) {
//         console.log('主键查询结果：')
//         console.log(request.result)
//         // resolve(request.result)
//     }
// }

// /**
//  * 游标读取
//  * @params db 数据库实例
//  * @params storeName 仓库名称
//  * @returns
//  */
// export function cursorGetData(db,storeName) {
//     let list = []
//     let store = db
//         .transaction(storeName,"readwrite")
//         .objectStore(storeName)
//     let request = store.openCursor()

//     request.onsuccess = function(e) {
//         let cursor = e.target.result
//         if(cursor) {
//             list.push(cursor.value)
//             cursor.continue()
//         } else {
//             console.log('游标读取的数据：')
//             console.log(list)
//         }
//     }

// }

// /**
//  * 索引查找
//  * @params db 数据库实例
//  * @params storeName 仓库名称
//  * @params indexName 索引名称
//  * @params indexValue 索引值
//  * @returns
//  */
// export function getDataByIndex(db,storeName,indexName,indexValue) {
//     let list = []
//     let store = db
//         .transaction(storeName,"readwrite")
//         .objectStore(storeName)
//     let request = store.index(indexName).get(indexValue)

//     request.onerror = function(event) {
//         console.log('事务失败')
//         console.log(event)
//     }

//     request.onsuccess = function(event) {
//         console.log('索引查询结果：')
//         console.log(event.target.result)
//         // resolve(event.target.result)
//     }

// }

// /**
//  * 游标索引查找
//  * @params db 数据库实例
//  * @params storeName 仓库名称
//  * @params indexName 索引名称
//  * @params indexValue 索引值
//  * @returns
//  */
// export function cursorGetDataByIndex(db,storeName,indexName,indexValue) {
//     let list = []
//     let store = db
//         .transaction(storeName,"readwrite")
//         .objectStore(storeName)
//     let request = store
//         .index(indexName)
//         .openCursor(IDBKeyRange.only(indexValue)) //指针对象

//     request.onsuccess = function(e) {
//         let cursor = e.target.result
//         if(cursor) {
//             list.push(cursor.value)
//             cursor.continue()
//         } else {
//             console.log('游标索引查询结果：')
//             console.log(list)
//         }
//     }

// }

// /**
//  * 通过索引游标分页查询
//  * @params db 数据库实例
//  * @params storeName 仓库名称
//  * @params indexName 索引名称
//  * @params indexValue 索引值
//  * @params page 页码
//  * @params pageSize 每页大小
//  * @returns
//  */
// export function cursorGetDataByIndexAndPage(
//     db,
//     storeName,
//     indexName,
//     indexValue,
//     page,
//     pageSize
// ) {
//     let list = []
//     let counter = 0 // 计数器
//     let advanced = true // 是否跳过多少条查询
//     let store = db
//         .transaction(storeName,"readwrite")
//         .objectStore(storeName)
//     let request = store
//         .index(indexName)
//         .openCursor(IDBKeyRange.only(indexValue))

//     request.onsuccess = function(e) {
//         let cursor = e.target.result

//         if(page > 1 && advanced) {
//             advanced = false
//             cursor.advanced((page - 1) * pageSize)
//             return
//         }

//         if(cursor) {
//             list.push(cursor.value)
//             cursor.continue()
//         } else {
//             console.log('游标索引查询结果：')
//             console.log(list)
//         }
//     }
// }

// /**
//  * 更新数据
//  * @params db 数据库实例
//  * @params storeName 仓库名称
//  * @params indexName 索引名称
//  * @params indexValue 索引值
//  * @params page 页码
//  * @params pageSize 每页大小
//  * @returns
//  */
// export function updateDB(db, storeName, data) {
//     let store = db
//         .transaction(storeName,"readwrite")
//         .objectStore(storeName)
//         .put(data)

//     request.onsuccess = function(e) {
//         console.log("数据更新成功！")
//     }
//     request.onerror = function(e) {
//         console.log("数据更新失败！")
//     }
// }

// /**
//  * 删除数据
//  * @params db 数据库实例
//  * @params storeName 仓库名称
//  * @params id 索引名称
//  * @returns
//  */
// export function deleteDB(db, storeName, id) {
//     let store = db
//         .transaction(storeName,"readwrite")
//         .objectStore(storeName)
//         .delete(id)

//     request.onsuccess = function(e) {
//         console.log('数据删除成功！')
//     }

//     request.onerror = function(e) {
//         console.log('数据删除失败！')
//     }
// }

// /**
//  * 删除数据库
//  * @params dbName 数据库名称
//  */
// export function deleteAll(dbName) {
//     let deleteRequest = window.indexdDB.deleteDatabase(dbName)
//     deleteRequest.onsuccess = function(e) {
//         console.log('数据删除成功！')
//     }

//     deleteRequest.onerror = function(e) {
//         console.log('数据删除失败！')
//     }
// }

// /**
//  * 通过索引游标删除数据
//  * @params db 数据库实例
//  * @params storeName 仓库名称
//  * @params indexName 索引名称
//  * @params indexValue 索引值
//  */
// export function cursorDelete(db,storeName,indexName,indexValue) {
//     let store = db
//         .transaction(storeName,"readwrite")
//         .objectStore(storeName)
//     let request = store
//         .index(indexName)
//         .openCursor(IDBKeyRange.only(indexValue)) //指针对象

//     request.onsuccess = function(e) {
//         let cursor = e.target.result
//         let deleteRequest;
//         if(cursor) {
//             deleteRequest = cursor.delete()
//             deleteRequest.onerror = function() {
//                 console.log('游标删除该记录失败！')
//             }
//             deleteRequest.onsuccess = function() {
//                 console.log('游标删除该记录成功！')
//             }
//             cursor.continue()
//         }
//     }

// }

// /**
//  * 关闭
//  * @params db 数据库实例
//  */
// export function closeDB(db) {
//     db.close()
//     console.log('数据库已关闭')
// }
