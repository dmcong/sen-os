import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Badge } from 'sen-kit';
import { DynamicLogo } from 'helpers/loader';

const LogoInMarket = forwardRef(({ installed, ...others }, ref) => {
  if (installed) return <Badge.Ribbon text="Installed">
    <DynamicLogo {...others} ref={ref} />
  </Badge.Ribbon>
  return <DynamicLogo {...others} ref={ref} />
});

LogoInMarket.defaultProps = {
  installed: false,
  onClick: () => { }
}

LogoInMarket.propTypes = {
  installed: PropTypes.bool,
  onClick: () => { }
}

export default LogoInMarket;