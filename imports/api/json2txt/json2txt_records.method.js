import fs from 'fs/promises'
import path from 'path'
import { Meteor } from 'meteor/meteor'

import { json2txtEmitter } from './json2txt_observer'

const dataPath = process.env.JSON2TXT_DATA

Meteor.methods({
    async 'updateJson2txtRecord' (recordId, record) {
        const fileToUpdate = path.join(dataPath, `${recordId}.json`)
        const updatedRecord = {
            article_id: recordId,
            input: JSON.parse(record.input),
            output: record.output,
        }
        await fs.writeFile(fileToUpdate,
            JSON.stringify(updatedRecord, null, 4), { encoding: 'utf-8' })
            json2txtEmitter.emit('update', updatedRecord)
    },

    async 'removeJson2txtRecord' (recordId) {
        const fileToRemove = path.join(dataPath, `${recordId}.json`)
        await fs.rm(fileToRemove)
        json2txtEmitter.emit('remove', recordId)
    },

    async 'insertJson2txtRecord' (recordId, record) {
        const fileToAdd = path.join(dataPath, `${recordId}.json`)
        const addedRecord = {
            article_id: recordId,
            input: JSON.parse(record.input),
            output: record.output,
        }
        await fs.writeFile(
            fileToAdd,
            JSON.stringify(addedRecord, null, 4),
            { encoding: 'utf-8' }
        )
        json2txtEmitter.emit('add', addedRecord)
    }
})
