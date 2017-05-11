import React, { Component } from 'react'
import { connect } from 'react-redux'

// import { actions as tempActions } from '../Redux/temp'
import { setDefaults } from '../Services/Api'
// import HomeTopBar from './HomeTopBar'

class Homepage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      temp: null,
    }
    setDefaults()
  }

  componentDidMount() {
    this.props.dispatch({ type: 'MOUNT' })
  }

  componentDidUpdate() {
    if (this.props.mounted) {
      this.props.dispatch({ type: 'AUTH/INIT_OPEN_LOCK' })
    }
  }

  render() {
    return (
      <div>
        {this.props.mounted ? 'I AM MOUNTED' : 'I AM NOT MOUNTED'}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  mounted: state.login.mounted,
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  // dispatchMount: () => dispatch(tempActions.dispatchMountAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
