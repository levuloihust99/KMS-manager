import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

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
          rows="8"
          style={{width: "40%", backgroundColor: rowBgColor}}
          readOnly={true}
          ref={inputField}
          value={input}
          onChange={handleChangeInput}
        >
        </textarea>
        <textarea
          className="no-focus"
          rows="8"
          style={{width: "40%", backgroundColor: rowBgColor}}
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
