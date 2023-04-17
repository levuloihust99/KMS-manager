import fs from 'fs/promises'
import path from 'path'
import { Meteor } from 'meteor/meteor'

import { serverLogger } from '../lib/logger'
import { counter } from '../lib/counter'
import { emitter, createObserver, removeObserver } from '../lib/observer'
import { v4 as uuidv4 } from 'uuid'

const dataPath = "/home/dev/projects/KMS-admin/data/qas"

Meteor.publish('paginatedRecords', async function (offset, limit) {
    counter.publication += 1
    const subscriptionId = uuidv4()
    serverLogger.info(`Number of subscriptions: ${counter.publication}. Subscription ID: ${subscriptionId}`)
    let files
    try {
        files = await fs.readdir(dataPath)
    } catch (e) {
        console.error("Failed to read directory!")
    }
    files = files.slice(offset, offset + limit)
    for (const f of files) {
        const fileContent = await fs.readFile(path.join(dataPath, f), { encoding: 'utf-8' })
        const record = JSON.parse(fileContent)
        this.added('records', record.article_id, record)
    }
    this.ready()

    // setup the observer: the most important part
    const observer = createObserver(subscriptionId)
    observer.addListener('update', (record) => {
        console.log(`Observed an 'update' on subscription ${subscriptionId}`)
        this.changed('records', record.article_id, record)
    })
    observer.addListener('remove', (recordId) => {
        console.log(`Observed a 'remove' on subscription ${subscriptionId}`)
        this.removed('records', recordId)
    })
    observer.addListener('add', (record) => {
        console.log(`Observed a 'add' on subscription ${subscriptionId}`)
        this.added('records', record.article_id, record)
    })

    // clean the observer
    this.onStop(() => {
        observer.removeAllListeners('update')
        observer.removeAllListeners('remove')
        observer.removeAllListeners('add')
        removeObserver(subscriptionId)
        console.log(`Unsubscribed ${subscriptionId}`)
    })
})

Meteor.methods({
    async 'updateRecord' (recordId, record) {
        const fileToUpdate = path.join(dataPath, `${recordId}.json`)
        const updatedRecord = {
            article_id: recordId,
            question: record.question,
            context: record.context
        }
        await fs.writeFile(fileToUpdate,
            JSON.stringify(updatedRecord, null, 4), { encoding: 'utf-8' })
        emitter.emit('update', updatedRecord)
    },

    async 'removeRecord' (recordId) {
        const fileToRemove = path.join(dataPath, `${recordId}.json`)
        await fs.rm(fileToRemove)
        emitter.emit('remove', recordId)
    },

    async 'insertRecord' (recordId, record) {
        const fileToAdd = path.join(dataPath, `${recordId}.json`)
        const addedRecord = {
            article_id: recordId,
            question: record.question,
            context: record.context
        }
        await fs.writeFile(
            fileToAdd,
            JSON.stringify(addedRecord, null, 4),
            { encoding: 'utf-8' }
        )
        emitter.emit('add', recordId, addedRecord)
    }
})
