import fs from 'fs/promises'
import path from 'path'
import { Meteor } from 'meteor/meteor'

import { json2txtCounter } from './json2txt_observer'
import { createObserver, removeObserver } from './json2txt_observer'
import { v4 as uuidv4 } from 'uuid'

const dataPath = process.env.JSON2TXT_DATA

Meteor.publish('paginatedJson2txtRecords', async function (offset, limit) {
    json2txtCounter.subscription += 1
    const subscriptionId = uuidv4()
    console
        .info(`Number of paginated-json2txt subscriptions: ${json2txtCounter.subscription}. Subscription ID: ${subscriptionId}`)
    let files
    try {
        files = await fs.readdir(dataPath)
        files = files.filter(f => f !== '.git')
    } catch (e) {
        console.error("Failed to read directory!")
    }
    files = files.slice(offset, offset + limit)
    for (const f of files) {
        const fileContent = await fs.readFile(path.join(dataPath, f), { encoding: 'utf-8' })
        const record = JSON.parse(fileContent)
        record.input = JSON.stringify(record.input, null, 4)
        this.added('json2txtRecords', record.article_id, record)
    }
    this.ready()

    // setup the observer: the most important part
    const observer = createObserver(subscriptionId)
    observer.addListener('update', (record) => {
        console.log(`Observed an 'update-json2txt' on subscription ${subscriptionId}`)
        const input = JSON.stringify(record.input, null, 4)
        this.changed('json2txtRecords', record.article_id, Object.assign({}, record, { input }))
    })
    observer.addListener('remove', (recordId) => {
        console.log(`Observed a 'remove-json2txt' on subscription ${subscriptionId}`)
        this.removed('json2txtRecords', recordId)
    })
    observer.addListener('add', (record) => {
        console.log(`Observed a 'add-json2txt' on subscription ${subscriptionId}`)
        const input = JSON.stringify(record.meta, null, 4)
        this.added('json2txtRecords', record.article_id, Object.assign({}, record, { input }))
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

Meteor.publish('json2txtRecordCount', async function () {
    const files = await fs.readdir(dataPath)
    this.added('json2txtRecordCount', 'number-of-record', { count: files.length })
    this.ready()
    this.onStop(() => {})
})
