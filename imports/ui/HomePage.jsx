import React from 'react'
import { Menu } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom"

export const HomePage = ({ props }) => {
  const navigate = useNavigate()
  const { qa: shouldRenderQA, corpus: shouldRenderCorpus, json2txt: shouldRenderJson2txt } = props

  const handleClickQAItem = () => {
    navigate('/qa')
  }

  const handleClickCorpusItem = () => {
    navigate('/corpus')
  }

  const handleClickJson2txtItem = () => {
    navigate('/json2txt')
  }

  if (!Object.values(props).includes(true)) {
    return <h1>There is no active manager.</h1>
  } else {
    return (
      <Menu vertical>
        {shouldRenderQA &&
          <Menu.Item
            name="qa"
            onClick={handleClickQAItem}
          >
            Question-Anwsering Management
          </Menu.Item>
        }
        {shouldRenderCorpus &&
          <Menu.Item
            name="corpus"
            onClick={handleClickCorpusItem}
          >
            Corpus Management
          </Menu.Item>
        }
        {shouldRenderJson2txt &&
          <Menu.Item
            name="json2txt"
            onClick={handleClickJson2txtItem}
          >
            Json2txt Management
          </Menu.Item>
        }
      </Menu>
    )
  }
}
