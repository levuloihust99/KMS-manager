import fs from 'fs/promises'
import path from 'path'
import { Meteor } from 'meteor/meteor'

import { corpusCounter } from './corpus_observer'
import { createObserver, removeObserver } from './corpus_observer'
import { v4 as uuidv4 } from 'uuid'

const dataPath = process.env.CORPUS_DATA

Meteor.publish('paginatedCorpusRecords', async function (offset, limit) {
    corpusCounter.subscription += 1
    const subscriptionId = uuidv4()
    console
        .info(`Number of paginated-corpus subscriptions: ${corpusCounter.subscription}. Subscription ID: ${subscriptionId}`)
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
        record.meta = JSON.stringify(record.meta, null, 4)
        this.added('corpusRecords', record.article_id, record)
    }
    this.ready()

    // setup the observer: the most important part
    const observer = createObserver(subscriptionId)
    observer.addListener('update', (record) => {
        console.log(`Observed an 'update-corpus' on subscription ${subscriptionId}`)
        const meta = JSON.stringify(record.meta, null, 4)
        this.changed('corpusRecords', record.article_id, Object.assign({}, record, { meta }))
    })
    observer.addListener('remove', (recordId) => {
        console.log(`Observed a 'remove-corpus' on subscription ${subscriptionId}`)
        this.removed('corpusRecords', recordId)
    })
    observer.addListener('add', (record) => {
        console.log(`Observed a 'add-corpus' on subscription ${subscriptionId}`)
        const meta = JSON.stringify(record.meta, null, 4)
        this.added('corpusRecords', record.article_id, Object.assign({}, record, { meta }))
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

Meteor.publish('corpusRecordCount', async function () {
    const files = await fs.readdir(dataPath)
    this.added('corpusCount', 'number-of-record', { count: files.length })
    this.ready()
    this.onStop(() => {})
})
