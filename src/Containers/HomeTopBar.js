import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions as tempActions } from '../Redux/temp'

class HomeTopBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      temp: 'a',
    }
  }

  render() {
    return (
      <div>
        <button onClick={auth.login}>THIS IS MY LOGIN BUTTON</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loggedIn: state.temp.mounted,
  auth: state.login.auth,
})

const mapDispatchToProps = dispatch => ({
  dispatchMount: () => dispatch(tempActions.dispatchMountAction()),
  dispatchReplaceHistory: () => dispatch(replace('/')),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeTopBar)
