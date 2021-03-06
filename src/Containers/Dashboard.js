import React, { Component } from 'react'
import { connect } from 'react-redux'

import { actions as loginActions } from '../Redux/Duck.Login'
import { actions as userActions } from '../Redux/Duck.User'
import { removeTokens } from '../Services/AuthServices'
import { del } from '../Services/Api'
import Topbar from '../Components/Topbar'
import Sidebar from '../Components/Sidebar'
import './Styles/css/Dashboard.css'

// const url = 'http://localhost:2020'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    if (!this.props.profile) {
      this.props.history.push('/')
    } else {
      console.log('DO I HAVE THE ID: ', this.props.simple_id)
      this.props.dispatch(loginActions.eventSourceConnect(this.props.simple_id))
    }
  }

  logout() {
    del
      .logout()
      .catch(console.error)
    this.props.history.push('/')
    this.props.dispatch(loginActions.authLogout())
    this.props.dispatch(userActions.userRemove())
    removeTokens()
  }

  testButton() {
    console.log('This is a button')
  }


  handleMouseDown = () => {
    this.testButton()
  }

  handleTouchStart = e => {
    e.preventDefault()
    this.handleMouseDown()
  }

  render() {
    console.log('This is the followers count: ', this.props.followers_count)
    if (!this.props.profile) return null
    return (
      <div className="dashboard-container">
        <div className="topbar-container-grd">
          <Topbar
            logout={this.logout}
            {...this.props.profile}
            screen={this.props.profile.screen_name}
          />
        </div>
        <div className="sidebar-container-grd">
          <Sidebar haters={this.props.haters} />
        </div>
        <div className="content-container-grd">

          <button
            onMouseDown={this.handleMouseDown}
            onTouchStart={this.handleTouchStart}
          >This is the testing Button...
          </button>
          This is my auth status: {this.props.authStatus}
        </div>
      </div>
    )
  }
}

// ------------------ REDUX -------------------- //

const mapStateToProps = state => ({
  authStatus: state.login.authStatus,
  profile: state.user.profile,
  simple_id: state.user.simple_id,
  haters: state.user.haters,
  followers_count: state.user.followers_count,
  router: state.router,

})

export default connect(mapStateToProps, dispatch => ({ dispatch }))(Dashboard)
