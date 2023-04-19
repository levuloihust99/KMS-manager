import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Meteor } from 'meteor/meteor'

import { qaCounter } from './qa_observer'
import { createObserver, removeObserver } from './qa_observer'
import { sortFiles } from '../../lib/utils'

const dataPath = process.env.QA_DATA

Meteor.publish('paginatedQARecords', async function (offset, limit) {
    qaCounter.subscription += 1
    const subscriptionId = uuidv4()
    const publishedKeys = {}
    console
        .info(`Number of paginated-qa subscriptions: ${qaCounter.subscription}. Subscription ID: ${subscriptionId}`)
    let files
    try {
        files = await fs.readdir(dataPath)
        files = files.filter(f => f !== '.git')
    } catch (e) {
        console.error("Failed to read directory!")
    }
    files = files.map(f => path.join(dataPath, f))
    files = await sortFiles(files)
    files = files.slice(offset, offset + limit)
    for (const f of files) {
        const fileContent = await fs.readFile(path.join(dataPath, f), { encoding: 'utf-8' })
        const record = JSON.parse(fileContent)
        publishedKeys[record.article_id] = true
        this.added('qaRecords', record.article_id, record)
    }
    this.ready()

    // setup the observer: the most important part
    const observer = createObserver(subscriptionId)
    observer.addListener('update', (record) => {
        if (!publishedKeys[record.article_id]) return
        console.log(`Observed an 'update-qa' on subscription ${subscriptionId}`)
        this.changed('qaRecords', record.article_id, record)
    })
    observer.addListener('remove', (recordId) => {
        if (!publishedKeys[recordId]) return
        console.log(`Observed a 'remove-qa' on subscription ${subscriptionId}`)
        delete publishedKeys[recordId]
        this.removed('qaRecords', recordId)
    })
    observer.addListener('add', (record) => {
        console.log(`Observed a 'add-qa' on subscription ${subscriptionId}`)
        publishedKeys[record.article_id] = true
        this.added('qaRecords', record.article_id, record)
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

Meteor.publish('qaRecordCount', async function () {
    let files = await fs.readdir(dataPath)
    files = files.filter(f => f !== '.git')
    this.added('qaCount', 'number-of-record', { count: files.length })
    this.ready()
    this.onStop(() => {})
})
