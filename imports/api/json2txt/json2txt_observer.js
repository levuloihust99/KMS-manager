import { EventEmitter } from 'events'

export const json2txtEmitter = new EventEmitter()
export const json2txtCounter = { subscription: 0 }

const observerPool = {}

json2txtEmitter.on('update', function (record) {
    Object.entries(observerPool).forEach(([subscriptionId, observer]) => {
        observer.emit('update', record)
    })
})

json2txtEmitter.on('remove', function (recordId) {
    Object.entries(observerPool).forEach(([subscriptionId, observer]) => {
        observer.emit('remove', recordId)
    })
})

json2txtEmitter.on('add', function (record) {
    Object.entries(observerPool).forEach(([subscriptionId, observer]) => {
        observer.emit('add', record)
    })
})

export function createObserver (subscriptionId) {
    observer = new EventEmitter()
    observerPool[subscriptionId] = observer
    return observer
}

export function removeObserver (subscriptionId) {
    delete observerPool[subscriptionId]
}
