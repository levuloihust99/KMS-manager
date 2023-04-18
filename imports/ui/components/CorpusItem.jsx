import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import { displayError } from './utils/Errors';

export const CorpusItem = (props) => {
  const [title, setTitle] = React.useState(props.title)
  const [text, setText] = React.useState(props.text)
  const [meta, setMeta] = React.useState(props.meta)
  const [previousTitle, setPreviousTitle] = React.useState(props.title)
  const [previousText, setPreviousText] = React.useState(props.text)
  const [previousMeta, setPreviousMeta] = React.useState(props.meta)
  const [onEdit, setOnEdit] = React.useState(false)

  const titleField = React.useRef()
  const textField = React.useRef()
  const metaField = React.useRef()

  const handleChangeTitle = (event) => {
    setTitle(event.target.value)
  }

  const handleChangeText = (event) => {
    setText(event.target.value)
  }

  const handleChangeMeta = (event) => {
    setMeta(event.target.value)
  }

  const rowBgColor = (props.rowIdx % 2 == 0) ? "#E6E6E6" : "#FFFFFF"

  const handleClickEdit = () => {
    titleField.current.readOnly = false
    textField.current.readOnly = false
    metaField.current.readOnly = false
    setOnEdit(true)
  }

  const handleClickUpdate = () => {
    // validate meta value
    try {
      JSON.parse(meta)
    } catch (e) {
      displayError({ reason: 'Meta field is not a valid JSON' })
      return
    }
    titleField.current.readOnly = true
    textField.current.readOnly = true
    metaField.current.readOnly = true
    setOnEdit(false)
    setPreviousTitle(title)
    setPreviousText(text)
    setPreviousMeta(meta)
    Meteor.call('updateCorpusRecord', props.articleId, { title, text, meta }, (err, response) => {
      if (err) {
        console.log("Failed to update the corpus record!")
      } else {
        console.log(`Updated corpus record ${props.articleId}`)
      }
    })
  }

  const handleClickCancel = () => {
    titleField.current.readOnly = true
    textField.current.readOnly = true
    metaField.current.readOnly = true
    setOnEdit(false)
    setTitle(previousTitle)
    setText(previousText)
    setMeta(previousMeta)
  }

  const renderUtilityButton = () => {
    if (!onEdit) {
      return (
        <div className="button-container">
          <Button
            primary
            onClick={handleClickEdit}
            className="fix-width-button"
          >
            Edit
          </Button>
        </div>
      )
    } else {
      return (
        <div className="button-container">
          <Button
            primary
            onClick={handleClickUpdate}
            className="fix-width-button"
          >
            Update
          </Button>
          <Button
            onClick={handleClickCancel}
            className="fix-width-button"
          >
            Cancel
          </Button>
        </div>
      )
    }
  }

  React.useEffect(() => {
    setTitle(props.title)
    setText(props.text)
    setMeta(props.meta)
  }, [props.question, props.context, props.meta])

  return (
    <div className="row-item">
      <div className="row-main-content" style={{backgroundColor: rowBgColor}}>
        <span
          style={{width: "15%"}}
        >
          {props.articleId}
        </span>
        <textarea
          className="no-focus"
          rows="5"
          style={{width: "15%", backgroundColor: rowBgColor}}
          readOnly={true}
          ref={titleField}
          value={title}
          onChange={handleChangeTitle}
        >
        </textarea>
        <textarea
          className="no-focus"
          rows="5"
          style={{width: "35%", backgroundColor: rowBgColor}}
          readOnly={true}
          ref={textField}
          value={text}
          onChange={handleChangeText}
        >
        </textarea>
        <textarea
          className="no-focus"
          rows="5"
          style={{width: "30%", backgroundColor: rowBgColor}}
          readOnly={true}
          ref={metaField}
          value={meta}
          onChange={handleChangeMeta}
        >
        </textarea>
      </div>    
      {renderUtilityButton()}
    </div>
  )
}
