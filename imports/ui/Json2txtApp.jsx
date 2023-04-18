import React from 'react';
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { Modal, Loader, Button } from "semantic-ui-react"

import { Json2txtItem } from './components/Json2txtItem.jsx';
import { Json2txtRecordCount, Json2txtRecords } from '../db/models.js';
import { GitOps } from './GitOps.jsx';

const PAGE_SIZE = 5

export const Json2txtApp = () => {
  const [page, setPage] = React.useState(0)
  const { isLoading, records, recordCount } = useTracker(() => {
    const handles = [
      Meteor.subscribe('json2txtRecordCount'),
      Meteor.subscribe('paginatedJson2txtRecords', page * PAGE_SIZE, PAGE_SIZE)
    ]
    const isLoading = !handles.every(handle => handle.ready())
    const records = Json2txtRecords.find().fetch()
    const recordCount = Json2txtRecordCount.findOne({ _id: 'number-of-record' })
    return { isLoading, records, recordCount }
  })

  const renderRecords = () => {
    return records.map((record, idx) => (
      <Json2txtItem
        key={idx}
        rowIdx={idx}
        input={record.input}
        output={record.output}
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
    const numPages = Math.floor((recordCount.count + PAGE_SIZE - 1) / PAGE_SIZE)
    const minPage = Math.max(0, page - 2)
    const maxPage = Math.min(numPages - 1, page + 2)
    let pageButtons = []
    for (let i = minPage; i <= maxPage; i++) {
      if (i == page) {
        pageButtons.push(<Button key={`page-button-${i}`} primary>{page + 1}</Button>)
      } else {
        pageButtons.push((
          <Button
            key={`page-button-${i}`}
            onClick={() => setPage(i)}
          >
            {i + 1}
          </Button>
        ))
      }
    }
    if (minPage > 0) {
      const beginButton = (
        <Button key={`page-button-begin`} onClick={() => setPage(0)}>begin</Button>
      )
      const dots = (
        <span key="dot-after-begin" style={{marginLeft: "10px", marginRight: "10px"}}>
          . . .
        </span>
      )
      pageButtons = [beginButton, dots, ...pageButtons]
    }
    if (maxPage < numPages - 1) {
      const endButton = (
        <Button key={`page-button-end`} onClick={() => setPage(numPages - 1)}>end</Button>
      )
      const dots = (
        <span key="dot-before-end" style={{marginLeft: "10px", marginRight: "10px"}}>
          . . .
        </span>
      )
      pageButtons = [...pageButtons, dots, endButton]
    }
    return (
      <div className="pagination">
        {pageButtons}
      </div>
    )
  }

  const renderPageHeader = () => {
    return (
      <div className="page-header">
        <GitOps type="json2txt"/>
        {renderPagination()}
      </div>
    )
  }

  return (
    <>
      {isLoading ? 
        renderLoadingPage() :
        <>
          {renderPageHeader()}
          {renderRecords()}
        </>
      }
    </>
  )
}
