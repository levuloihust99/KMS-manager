import { EventEmitter } from 'events'

export const corpusEmitter = new EventEmitter()
export const corpusCounter = { subscription: 0 }

const observerPool = {}

corpusEmitter.on('update', function (record) {
    Object.entries(observerPool).forEach(([subscriptionId, observer]) => {
        observer.emit('update', record)
    })
})

corpusEmitter.on('remove', function (recordId) {
    Object.entries(observerPool).forEach(([subscriptionId, observer]) => {
        observer.emit('remove', recordId)
    })
})

corpusEmitter.on('add', function (record) {
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
