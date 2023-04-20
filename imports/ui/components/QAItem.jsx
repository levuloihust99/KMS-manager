import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Button, Icon } from 'semantic-ui-react'

export const QAItem = (props) => {
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
    Meteor.call('updateQARecord', props.articleId, { question, context }, (err, response) => {
      if (err) {
        console.log("Failed to update the qa record!")
      } else {
        console.log(`Updated qa record ${props.articleId}`)
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

  const handleClickRemove = () => {
    Meteor.call('removeQARecord', props.articleId, (err, response) => {
      if (err) {
        console.log("Failed to remove the qa record!")
      } else {
        console.log(`Removed qa record ${props.articleId}`)
      }
    })
  }

  const renderUtilityButton = () => {
    if (!onEdit) {
      return (
        <div className="button-container">
          <div className="horizontal-button-container">
            <Button
              icon
              size='tiny'
              onClick={handleClickEdit}
            >
              <Icon name="edit" />
            </Button>
            <Button
              icon
              size='tiny'
              onClick={handleClickRemove}
            >
              <Icon name="times" />
            </Button>
          </div>
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
    setQuestion(props.question)
    setContext(props.context)
  }, [props.question, props.context])

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
          style={{width: "25%", backgroundColor: rowBgColor}}
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

export const InsertedQAItem = ({ articleId, changeInsertStatus }) => {
  const [question, setQuestion] = React.useState('')
  const [context, setContext] = React.useState('')

  const handleChangeQuestion = (event) => {
    setQuestion(event.target.value)
  }

  const handleChangeContext = (event) => {
    setContext(event.target.value)
  }

  const handleConfirmInsert = () => {
    changeInsertStatus(false)
    Meteor.call('insertQARecord', articleId, { question, context }, (err, response) => {
      if (err) {
        console.log("Failed to insert the qa record!")
      } else {
        console.log(`Inserted qa record ${articleId}`)
      }
    })
  }

  const handleCancelInsert = () => {
    changeInsertStatus(false)
  }

  return (
    <div className="row-item">
      <div className="added-row">
        <span
          style={{width: "15%"}}
        >
          {articleId}
        </span>
        <textarea
          rows="8"
          style={{width: "25%"}}
          value={question}
          onChange={handleChangeQuestion}
        >
        </textarea>
        <textarea
          rows="8"
          style={{width: "55%"}}
          value={context}
          onChange={handleChangeContext}
        >
        </textarea>
      </div>
      <div className="button-container">
        <Button className="fix-width-button" primary onClick={handleConfirmInsert}>Insert</Button>
        <Button
          className="fix-width-button"
          negative
          onClick={handleCancelInsert}
          style={{ marginTop: "5px" }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
