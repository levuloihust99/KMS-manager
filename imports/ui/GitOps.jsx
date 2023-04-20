import React from 'react'
import { Button } from 'semantic-ui-react'
import { Meteor } from 'meteor/meteor'

export const GitOps = ({ managerType }) => {
  const handleGitAdd = () => {
    Meteor.call('gitAdd', managerType, (err, response) => {
      if (err) console.log(err)
      else alert(response)
    })
  }

  const handleGitCommit = () => {
    Meteor.call('gitCommit', managerType, (err, response) => {
      if (err) console.log(err)
      else alert(response)
    })
  }

  return (
    <div>
      <Button primary onClick={handleGitAdd}>Add</Button>
      <Button primary onClick={handleGitCommit}>Commit</Button>
    </div>
  )
}
