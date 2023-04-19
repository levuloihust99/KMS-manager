import fs from 'fs/promises'
import path from 'path'
import { Meteor } from 'meteor/meteor'

import { corpusEmitter } from './corpus_observer'

const dataPath = process.env.CORPUS_DATA

Meteor.methods({
    async 'updateCorpusRecord' (recordId, record) {
        const fileToUpdate = path.join(dataPath, `${recordId}.json`)
        const updatedRecord = {
            article_id: recordId,
            title: record.title,
            text: record.text,
            meta: JSON.parse(record.meta)
        }
        await fs.writeFile(fileToUpdate,
            JSON.stringify(updatedRecord, null, 4), { encoding: 'utf-8' })
            corpusEmitter.emit('update', updatedRecord)
    },

    async 'removeCorpusRecord' (recordId) {
        const fileToRemove = path.join(dataPath, `${recordId}.json`)
        await fs.rm(fileToRemove)
        corpusEmitter.emit('remove', recordId)
    },

    async 'insertCorpusRecord' (recordId, record) {
        const fileToAdd = path.join(dataPath, `${recordId}.json`)
        const addedRecord = {
            article_id: recordId,
            title: record.title,
            text: record.text,
            meta: JSON.parse(record.meta)
        }
        await fs.writeFile(
            fileToAdd,
            JSON.stringify(addedRecord, null, 4),
            { encoding: 'utf-8' }
        )
        corpusEmitter.emit('add', addedRecord)
    }
})
