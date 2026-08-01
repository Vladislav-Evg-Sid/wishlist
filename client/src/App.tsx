import { useReducer } from 'react'
import './App.css'
import { Typography } from '@mui/material';

import { type CurrentUI, type ReducerUIAction, type UIType } from './types/mainUI';
import { type User } from './types/user';
import Groups from './Pages/groups';

function getNextUIPage(curPage: UIType): UIType {
  switch (curPage) {
    case "groups":
      return "wishlicts"
    default:
      alert("Невозможно уйти глубже")
      return curPage
  }
}

function reduceCurrentUI(curUI: CurrentUI, action: ReducerUIAction): CurrentUI {
  switch (action.type) {
    case "goForvard":
      return {
        ...curUI,
        page: getNextUIPage(curUI.page),
      }
    default:
      alert("Неизвестное действие")
      return curUI
  }
}

function App() {
  const [curUI, dispatchUI] = useReducer(reduceCurrentUI, {page: "groups"})

  const user: User = {
    id: "123",
    name: "Влад"
  }

  return (
    curUI.page === "groups"
    ? <Groups
        dispatchUI={dispatchUI}
        user={user}
      />
    : <Typography>Нет данных</Typography>
  )
}

export default App
