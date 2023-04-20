import React from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { Modal, Loader } from "semantic-ui-react"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { QAApp } from './QAApp'
import { CorpusApp } from './CorpusApp'
import { Pages } from '../db/models'
import { Json2txtApp } from './Json2txtApp'
import { HomePage } from './HomePage'
import { ErrorPage } from './ErrorPage'

export const App = () => {
  const { isLoading, pages } = useTracker(() => {
    const handle = Meteor.subscribe('pageTypes')
    const pages = Pages.find().fetch()
    return { isLoading: !handle.ready(), pages }
  })

  const renderLoadingPage = () => {
    return (
      <Modal dimmer="blurring" open={isLoading} closeIcon={null}>
        <Loader active size="large">
          Loading
        </Loader>
      </Modal>
    )
  }

  const render = () => {
    if (isLoading) return renderLoadingPage()
    const shouldRenderQA = pages.map((page) => {
      if (page._id == 'qa-page') return true
      return false
    }).includes(true)
    const shouldRenderCorpus = pages.map((page) => {
      if (page._id == 'corpus-page') return true
      return false
    }).includes(true)
    const shouldRenderJson2txt = pages.map((page) => {
      if (page._id == 'json2txt-page') return true
      return false
    }).includes(true)

    // homepage props
    const shouldRender = {
      qa: shouldRenderQA,
      corpus: shouldRenderCorpus,
      json2txt: shouldRenderJson2txt
    }

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage props={shouldRender} />} />
          {shouldRenderQA &&
            <>
              <Route path="qa" element={<Navigate to="/qa/1" replace />} />
              <Route path="qa/:pageId" element={<QAApp />} />
            </>
          }
          {shouldRenderCorpus &&
            <>
              <Route path="corpus" element={<Navigate to="/corpus/1" />} />
              <Route path="corpus/:pageId" element={<CorpusApp />} />
            </>
          }
          {shouldRenderJson2txt &&
            <>
              <Route path="json2txt" element={<Navigate to="/json2txt/1" />} />
              <Route path="json2txt/:pageId" element={<Json2txtApp />} />
            </>
          }
          <Route path="/404" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/404" />}/>
        </Routes>
      </BrowserRouter>
    )
  }

  return render()
}
