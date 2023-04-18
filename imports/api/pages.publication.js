import { Meteor } from 'meteor/meteor'

Meteor.publish('pageTypes', async function () {
    if (process.env.QA_DATA) {
        this.added('pages', 'qa-page', { type: 'qa' })
    }
    if (process.env.CORPUS_DATA) {
        this.added('pages', 'corpus-page', { type: 'corpus' })
    }
    this.ready()
    this.onStop(() => {})
})
