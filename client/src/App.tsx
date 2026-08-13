import { useReducer } from 'react'
import './App.css'
import { Typography } from '@mui/material';

import {
  type CurrentUI,
  type ReducerUIAction,
} from './types/mainUI';
import { type User } from './types/user';
import Groups from './Pages/groups';
import Wishlists from './Pages/wishlists';

function getNextUI(curUI: CurrentUI, action: ReducerUIAction): CurrentUI {
  switch (curUI.page) {
    case "groups":
      return {
        ...curUI,
        page: "wishlists",
        parantElement: action.parantElement,
      }
    default:
      alert("Невозможно уйти глубже")
      return curUI
  }
}

function getPrevUI(curUI: CurrentUI, action: ReducerUIAction): CurrentUI {
  switch (curUI.page) {
    case "wishlists":
      return {
        ...curUI,
        page: "groups",
        parantElement: action.parantElement,
      }
    default:
      alert("Невозможно подняться выше")
      return curUI
  }
}

function App() {
  const [curUI, dispatchUI] = useReducer(reduceCurrentUI, {page: "groups"})
  
  const user: User = {
    id: "123",
    name: "Владислав"
  }
  
  function reduceCurrentUI(curUI: CurrentUI, action: ReducerUIAction): CurrentUI {
    switch (action.type) {
      case "goForvard":
        return getNextUI(curUI, action)
      case "goBack":
        return getPrevUI(curUI, action)
      default:
        alert("Неизвестное действие")
        return curUI
    }
  }

  return (
    curUI.page === "groups"
    ? <Groups
        user={user}
        dispatchUI={dispatchUI}
      />
    : curUI.page === "wishlists"
    ? <Wishlists
        dispatchUI={dispatchUI}
        group={curUI.parantElement}
        user={user}
      />
    : <Typography>Нет данных</Typography>
  )
}

export default App
