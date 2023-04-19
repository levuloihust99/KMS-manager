import fs from 'fs'

export const sortFiles = async (files) => {
    const fileInfos = await Promise.all(
        files.map((f) => {
            return new Promise((resolve, reject) => {
                fs.stat(f, (err, stats) => {
                    if (err) reject(err)
                    else {
                        resolve({
                            name: f,
                            createdTime: stats.birthtime
                        })
                    }
                })
            })
        })
    )
    fileInfos.sort((a, b) => a.createdTime - b.createdTime)
    const sortedFiles = fileInfos.map(f => f.name)
    return sortedFiles
}
