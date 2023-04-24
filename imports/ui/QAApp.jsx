import React from 'react';
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { Modal, Loader, Button, Icon } from "semantic-ui-react"
import { useParams, useNavigate, Navigate } from 'react-router-dom'

import { GitOps } from './GitOps.jsx';
import { getRandomString } from '../lib/random.js';

import { QARecordCount, QARecords } from '../db/models.js';
import { QAItem, InsertedQAItem } from './components/QAItem.jsx';

const PAGE_SIZE = 5

export const QAApp = () => {
  const navigate = useNavigate()
  const { pageId } = useParams()
  const page = pageId - 1
  if (Number.isNaN(page)) return <Navigate to="/404" />

  const [onInsert, setOnInsert] = React.useState(false)
  const { isLoading, records, recordCount } = useTracker(() => {
    const handles = [
      Meteor.subscribe('qaRecordCount'),
      Meteor.subscribe('paginatedQARecords', page * PAGE_SIZE, PAGE_SIZE)
    ]
    const isLoading = !handles.every(handle => handle.ready())
    const records = QARecords.find().fetch()
    const recordCount = QARecordCount.findOne({ _id: 'number-of-record' })
    return { isLoading, records, recordCount }
  })

  const renderRecords = () => {
    return records.map((record, idx) => (
      <QAItem
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
            onClick={() => navigate(`/qa/${i + 1}`)}
          >
            {i + 1}
          </Button>
        ))
      }
    }
    if (minPage > 0) {
      const beginButton = (
        <Button key={`page-button-begin`} onClick={() => navigate('/qa/1')}>begin</Button>
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
        <Button key={`page-button-end`} onClick={() => navigate(`/qa/${numPages}`)}>end</Button>
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
        <GitOps managerType="qa"/>
        {renderPagination()}
        {!onInsert &&
          <Button icon onClick={handleInsertRecord}><Icon name="add"/></Button>
        }
      </div>
    )
  }

  const renderOnInsertRecord = () => {
    const articleId = getRandomString()
    return <InsertedQAItem articleId={articleId} changeInsertStatus={setOnInsert}/>
  }

  const handleInsertRecord = () => {
    setOnInsert(true)
  }

  const render = () => {
    if (isLoading) return renderLoadingPage()
    const numPages = Math.floor((recordCount.count + PAGE_SIZE - 1) / PAGE_SIZE)
    if (page > numPages) return <Navigate to="/404" />
    return (
      <>
        {renderPageHeader()}
        {onInsert && renderOnInsertRecord()}
        {renderRecords()}
      </>
    )
  }

  return render()
}
