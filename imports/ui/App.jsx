import React from 'react';
import { Meteor } from 'meteor/meteor'
import { useTracker, withTracker } from 'meteor/react-meteor-data'
import { Icon, Button, Label, Popup, Modal, Loader } from "semantic-ui-react"

import { RowItem } from './components/RowItem.jsx';
import { Records } from '../db/records.model.js';

export const App = () => {
  const [page, setPage] = React.useState(0)
  const { isLoading, records } = useTracker(() => {
    const handle = Meteor.subscribe('paginatedRecords', page, page + 5)
    const records = Records.find().fetch()
    return { isLoading: !handle.ready(), records }
  })

  const renderRecords = () => {
    if (!records) return <h1>Data loading failed!</h1>
    return records.map((record, idx) => {
      return (
        <RowItem
          key={idx}
          rowIdx={idx}
          question={record.question}
          context={record.context}
          articleId={record.article_id}
        />
      )
    })
  }

  const renderLoadingPage = () => {
    return (
      <Modal dimmer="blurring" open={isLoading} closeIcon={null}>
        <Loader active size="large">
          Loading
        </Loader>
      </Modal>
    )
  }

  return (
    isLoading ? renderLoadingPage() : renderRecords()
  )
}

