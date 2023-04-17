import React from 'react';
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { Modal, Loader } from "semantic-ui-react"

import { RowItem } from './components/RowItem.jsx';
import { RecordCount, Records } from '../db/records.model.js';

const PAGE_SIZE = 5

export const App = () => {
  const [page, setPage] = React.useState(0)
  const { isLoading, records, recordCount } = useTracker(() => {
    const handles = [
      Meteor.subscribe('recordCount'),
      Meteor.subscribe('paginatedRecords', page, page + PAGE_SIZE)
    ]
    const isLoading = !handles.every(handle => handle.ready())
    const records = Records.find().fetch()
    const { count: recordCount } = RecordCount.findOne({ _id: 'number-of-record' }).fetch()
    return { isLoading, records, recordCount }
  })

  const renderRecords = () => {
    return records.map((record, idx) => (
      <RowItem
        key={idx}
        rowIdx={idx}
        question={record.question}
        context={record.context}
        articleId={record.article_id}
      />
    ))
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

  const renderPagination = () => {
    const numPages = Math.floor((recordCount + PAGE_SIZE - 1) / PAGE_SIZE)
    const minPage = Math.max(0, page - 2)
    const maxPage = Math.min(numPages - 1, page + 2)
    let pageButtons = []
    for (let i = minPage; i <= maxPage; i++) {
      if (i == page) {
        pageButtons.push(<Button primary>{page + 1}</Button>)
      } else {
        pageButtons.push((
          <Button
            onClick={() => setPage(i)}
          >
            {i + 1}
          </Button>
        ))
      }
    }
    if (minPage > 0) {
      const beginButton = (
        <Button onClick={() => setPage(0)}>begin</Button>
      )
      const dots = <span>...</span>
      pageButtons = [beginButton, dots, ...pageButtons]
    }
    if (maxPage < numPages - 1) {
      const endButton = (
        <Button onClick={() => setPage(numPages - 1)}>end</Button>
      )
      const dots = <span>...</span>
      pageButtons = [...pageButtons, dots, endButton]
    }
    return pageButtons
  }

  return (
    <>
      {isLoading ? renderLoadingPage() : renderRecords()}
      {renderPagination()}
    </>
  )
}
