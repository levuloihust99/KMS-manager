import React from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { Modal, Loader } from "semantic-ui-react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { QAApp } from './QAApp'
import { CorpusApp } from './CorpusApp'
import { Pages } from '../db/models'

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
    return (
      <BrowserRouter>
        <Routes>
          {shouldRenderQA && <Route path="qa" element={<QAApp />} />}
          {shouldRenderCorpus && <Route path="corpus" element={<CorpusApp />} />}
        </Routes>
      </BrowserRouter>
    )
  }

  return render()
}
