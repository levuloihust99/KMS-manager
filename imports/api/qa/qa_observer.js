import { EventEmitter } from 'events'

export const qaEmitter = new EventEmitter()
export const qaCounter = { subscription: 0 }

const observerPool = {}

qaEmitter.on('update', function (record) {
    Object.entries(observerPool).forEach(([subscriptionId, observer]) => {
        observer.emit('update', record)
    })
})

qaEmitter.on('remove', function (recordId) {
    Object.entries(observerPool).forEach(([subscriptionId, observer]) => {
        observer.emit('remove', recordId)
    })
})

qaEmitter.on('add', function (record) {
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
