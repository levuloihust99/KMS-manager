import nodegit from 'nodegit'

const path = "/home/dev/projects/KMS-admin/data/gitdir"

async function checkItOut () {
    const repo = await nodegit.Repository.open(path)
    const index = await repo.refreshIndex()
    console.log(index.entryCount())
    console.log(index.entries())
    index.readTree()
    nodegit.IndexEntry
}

checkItOut()