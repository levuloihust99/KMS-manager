import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Button, Icon } from 'semantic-ui-react'

import { displayError } from './utils/Errors';

export const Json2txtItem = (props) => {
  const [input, setInput] = React.useState(props.input)
  const [output, setOutput] = React.useState(props.output)
  const [previousInput, setPreviousInput] = React.useState(props.input)
  const [previousOutput, setPreviousOutput] = React.useState(props.output)
  const [onEdit, setOnEdit] = React.useState(false)

  const inputField = React.useRef()
  const outputField = React.useRef()

  const handleChangeInput = (event) => {
    setInput(event.target.value)
  }

  const handleChangeOutput = (event) => {
    setOutput(event.target.value)
  }

  const rowBgColor = (props.rowIdx % 2 == 0) ? "#E6E6E6" : "#FFFFFF"

  const handleClickEdit = () => {
    inputField.current.readOnly = false
    outputField.current.readOnly = false
    setOnEdit(true)
  }

  const handleClickUpdate = () => {
    // validate meta value
    try {
      JSON.parse(input)
    } catch (e) {
      displayError({ reason: 'Input field is not a valid JSON' })
      return
    }
    inputField.current.readOnly = true
    outputField.current.readOnly = true
    setOnEdit(false)
    setPreviousInput(input)
    setPreviousOutput(output)
    Meteor.call('updateJson2txtRecord', props.articleId, { input, output }, (err, response) => {
      if (err) {
        console.log("Failed to update the json2txt record!")
      } else {
        console.log(`Updated json2txt record ${props.articleId}`)
      }
    })
  }

  const handleClickCancel = () => {
    inputField.current.readOnly = true
    outputField.current.readOnly = true
    setOnEdit(false)
    setInput(previousInput)
    setOutput(previousOutput)
  }

  const handleClickRemove = () => {
    Meteor.call('removeJson2txtRecord', props.articleId, (err, response) => {
      if (err) {
        console.log("Failed to remove the json2txt record!")
      } else {
        console.log(`Removed json2txt record ${props.articleId}`)
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
    setInput(props.input)
    setOutput(props.output)
  }, [props.input, props.output])

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
          rows="10"
          style={{width: "35%", backgroundColor: rowBgColor}}
          readOnly={true}
          ref={inputField}
          value={input}
          onChange={handleChangeInput}
        >
        </textarea>
        <textarea
          className="no-focus"
          rows="10"
          style={{width: "50%", backgroundColor: rowBgColor}}
          readOnly={true}
          ref={outputField}
          value={output}
          onChange={handleChangeOutput}
        >
        </textarea>
      </div>    
      {renderUtilityButton()}
    </div>
  )
}

export const InsertedJson2txtItem = ({ articleId, changeInsertStatus }) => {
  const [input, setInput] = React.useState('')
  const [output, setOutput] = React.useState('')

  const handleChangeInput = (event) => {
    setInput(event.target.value)
  }

  const handleChangeOutput = (event) => {
    setOutput(event.target.value)
  }

  const handleConfirmInsert = () => {
    // validate meta value
    try {
      JSON.parse(input)
    } catch (e) {
      displayError({ reason: 'Input field is not a valid JSON' })
      return
    }
    changeInsertStatus(false)
    Meteor.call('insertJson2txtRecord', articleId, { input, output }, (err, response) => {
      if (err) {
        console.log("Failed to insert the json2txt record!")
      } else {
        console.log(`Inserted json2txt record ${articleId}`)
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
          style={{width: "35%"}}
          value={input}
          onChange={handleChangeInput}
        >
        </textarea>
        <textarea
          rows="8"
          style={{width: "50%"}}
          value={output}
          onChange={handleChangeOutput}
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
