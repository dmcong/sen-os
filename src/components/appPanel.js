import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Typography } from 'sen-kit';

import util from 'helpers/util';


/**
 * Application Panel
 */
const AppPanel = forwardRef(({ appName, src }, ref) => {
  // Infer color
  const bgColor = util.randomColor(util.normalizeAppName(appName), 'light');
  const symbol = appName.substring(0, 2);
  const txtColor = util.randomColor(symbol, 'dark', bgColor);
  // Build background
  const bg = src ? {
    backgroundImage: `url("${src}")`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  } : { backgroundColor: bgColor }
  // Render
  return <div style={{ width: '100%', borderRadius: 16, ...bg }} ref={ref}>
    <div style={{ width: '100%', paddingTop: '75%' }} />
    {src ? null : <div style={{
      width: '100%',
      position: 'absolute',
      top: 'calc(50% - 23px)',
      left: 0,
      verticalAlign: 'center',
      textAlign: 'center',
    }}>
      <Typography.Title
        level={1}
        style={{ marginBottom: 4, color: txtColor }}
      >{appName}</Typography.Title>
    </div>}
  </div>
});

AppPanel.defaultProps = {
  src: '',
}

AppPanel.propTypes = {
  src: PropTypes.string,
  appName: PropTypes.string.isRequired
}

export default AppPanel;