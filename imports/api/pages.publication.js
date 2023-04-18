import { Meteor } from 'meteor/meteor'

Meteor.publish('pageTypes', async function () {
    if (process.env.QA_DATA) {
        this.added('pages', 'qa-page', { type: 'qa' })
    }
    if (process.env.CORPUS_DATA) {
        this.added('pages', 'corpus-page', { type: 'corpus' })
    }
    if (process.env.JSON2TXT_DATA) {
        this.added('pages', 'json2txt-page', { type: 'json2txt' })
    }
    this.ready()
    this.onStop(() => {})
})
