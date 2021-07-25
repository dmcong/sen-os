import { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import { Row, Col, Typography, Widget, Button, Icon } from '@senswap/sen-ui'

import { DynamicLogo } from 'helpers/loader'
import { RootState, RootDispatch } from 'store'
import { updateApps, uninstallApp } from 'store/babysitter.reducer'

interface Props extends ConnectedProps<typeof connector>, RouteComponentProps {
  appName: string
  email: string
  version: string
}

interface State {
  failed: boolean
}

/**
 * Error Boundary
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      failed: false,
    }
  }

  componentDidCatch(error: Error) {
    return this.setState({ failed: Boolean(error) })
  }

  support = () => {
    const { email, appName } = this.props
    return window.open(
      `mailto:${email}?subject=${appName} has failed`,
      '_blank',
    )
  }

  render() {
    const { failed } = this.state
    const { appName, version, children, uninstallApp } = this.props

    if (failed || !children)
      return (
        <Widget type="glass">
          <Row
            gutter={[8, 8]}
            style={{ height: '100%' }}
            align="middle"
            justify="center"
          >
            <Col>
              <DynamicLogo name={appName} title={false} />
            </Col>
            <Col span={24}>
              <Typography.Title level={4} align="center">
                {appName}
              </Typography.Title>
              <p style={{ textAlign: 'center' }}>Version {version}</p>
            </Col>
            <Col span={24}>
              <p style={{ textAlign: 'center' }}>
                Oops! The application can't load properly
              </p>
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                icon={<Icon name="trash-outline" />}
                onClick={() => uninstallApp(appName)}
                block
              >
                Uninstall
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="text"
                icon={<Icon name="help-buoy-outline" />}
                onClick={this.support}
                block
              >
                Support
              </Button>
            </Col>
          </Row>
        </Widget>
      )
    return children
  }
}

const mapStateToProps = (state: RootState) => ({
  wallet: state.wallet,
  babysitter: state.babysitter,
})

const mapDispatchToProps = (dispatch: RootDispatch) => {
  return bindActionCreators(
    {
      updateApps,
      uninstallApp,
    },
    dispatch,
  )
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default withRouter(connector(ErrorBoundary))
