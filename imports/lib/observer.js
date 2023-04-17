import { EventEmitter } from 'events'

export const emitter = new EventEmitter()
const observerPool = {}

emitter.on('update', function (record) {
    Object.entries(observerPool).forEach(([subscriptionId, observer]) => {
        observer.emit('update', record)
    })
})

emitter.on('remove', function (recordId) {
    Object.entries(observerPool).forEach(([subscriptionId, observer]) => {
        observer.emit('remove', recordId)
    })
})

emitter.on('add', function (record) {
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
