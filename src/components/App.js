import React from 'react'
import { Switch, Route } from 'react-router-dom'

import {
  HomePage,
  SettingsPage,
  PaperPage,
} from 'components'

import {
  ProfilePage
} from 'containers'

const App = () => {
  return (
    <Switch>
      <Route path="/" component={HomePage} exact />
      <Route path="/@:username" component={ProfilePage} />
      <Route path="/papers/:paperId" component={PaperPage} />
      <Route path="/settings" component={SettingsPage} />
    </Switch>
  )
}

// class App extends PureComponent {
//   render () {
//     return (
//       <Switch>
//         <Route path="/" component={HomePage} exact />
//         <Route path="/profile/@:username" component={ProfilePage} exact />
//         <Route path="/setting" component={SettingPage} exact />
//       </Switch>
//     )
//   }
// }

export default App
