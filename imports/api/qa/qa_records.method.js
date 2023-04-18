import fs from 'fs/promises'
import path from 'path'
import { Meteor } from 'meteor/meteor'

import { qaEmitter } from './qa_observer'

const dataPath = process.env.CORPUS_PATH

Meteor.methods({
    async 'updateQARecord' (recordId, record) {
        const fileToUpdate = path.join(dataPath, `${recordId}.json`)
        const updatedRecord = {
            article_id: recordId,
            question: record.question,
            context: record.context
        }
        await fs.writeFile(fileToUpdate,
            JSON.stringify(updatedRecord, null, 4), { encoding: 'utf-8' })
            qaEmitter.emit('update', updatedRecord)
    },

    async 'removeQARecord' (recordId) {
        const fileToRemove = path.join(dataPath, `${recordId}.json`)
        await fs.rm(fileToRemove)
        qaEmitter.emit('remove', recordId)
    },

    async 'insertQARecord' (recordId, record) {
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
        qaEmitter.emit('add', recordId, addedRecord)
    }
})
