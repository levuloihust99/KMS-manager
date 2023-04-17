import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

export const RowItem = (props) => {
  const [question, setQuestion] = React.useState(props.question)
  const [context, setContext] = React.useState(props.context)
  const [previousQuestion, setPreviousQuestion] = React.useState(props.question)
  const [previousContext, setPreviousContext] = React.useState(props.context)
  const [onEdit, setOnEdit] = React.useState(false)

  const questionField = React.useRef()
  const contextField = React.useRef()

  const handleChangeQuestion = (event) => {
    setQuestion(event.target.value)
  }

  const handleChangeContext = (event) => {
    setContext(event.target.value)
  }

  const rowBgColor = (props.rowIdx % 2 == 0) ? "#E6E6E6" : "#FFFFFF"

  const handleClickEdit = () => {
    questionField.current.readOnly = false
    contextField.current.readOnly = false
    setOnEdit(true)
  }

  const handleClickUpdate = () => {
    questionField.current.readOnly = true
    contextField.current.readOnly = true
    setOnEdit(false)
    setPreviousQuestion(question)
    setPreviousContext(context)
    Meteor.call('updateRecord', props.articleId, { question, context }, (err, response) => {
      if (err) {
        console.log("Failed to update the record!")
      } else {
        console.log(`Updated record ${props.articleId}`)
      }
    })
  }

  const handleClickCancel = () => {
    questionField.current.readOnly = true
    contextField.current.readOnly = true
    setOnEdit(false)
    setQuestion(previousQuestion)
    setContext(previousContext)
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

  return (
    <div className="row-item">
      <div className="row-main-content" style={{backgroundColor: rowBgColor}}>
        <span
          style={{width: "20%"}}
        >
          {props.articleId}
        </span>
        <textarea
          className="no-focus"
          rows="5"
          style={{width: "20%", backgroundColor: rowBgColor}}
          readOnly={true}
          ref={questionField}
          value={question}
          onChange={handleChangeQuestion}
        >
        </textarea>
        <textarea
          className="no-focus"
          rows="5"
          style={{width: "55%", backgroundColor: rowBgColor}}
          readOnly={true}
          ref={contextField}
          value={context}
          onChange={handleChangeContext}
        >
        </textarea>
      </div>    
      {renderUtilityButton()}
    </div>
  )
}
