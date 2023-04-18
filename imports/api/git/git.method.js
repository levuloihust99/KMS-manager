import simpleGit from 'simple-git'
import { Meteor } from 'meteor/meteor'

Meteor.methods({
    async 'gitAdd' (type) {
        let path
        if (type === 'qa') {
            path = process.env.QA_DATA
        } else if (type === 'corpus') {
            path = process.env.CORPUS_DATA
        } else if (type === 'json2txt') {
            path = process.env.JSON2TXT_DATA
        }
        const git = simpleGit(path)
        const diff = await git.diff()
        if (!diff) {
            return "Nothing to add"
        }
        await git.add('-A') // stage all changes
        return "Successfully added changes to the stage"
    },

    async 'gitCommit' (type, msg = "data versioning") {
        let path
        if (type === 'qa') {
            path = process.env.QA_DATA
        } else if (type === 'corpus') {
            path = process.env.CORPUS_DATA
        } else if (type === 'json2txt') {
            path = process.env.JSON2TXT_DATA
        }
        const git = simpleGit(path)
        const diffCached = await git.diff(["--cached"])
        if (!diffCached) {
            return "Nothing to commit"
        }
        await git.commit(msg)
        return "Successfully create a commit"
    }
})
