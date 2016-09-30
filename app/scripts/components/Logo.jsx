import React from 'react';
import Isvg from 'react-inlinesvg';

import config from 'config';

const Logo = () =>
  (<div className="app__logo">
    <Isvg className="app__logo__large" src={require('assets/media/brand/logo.svg')}>
      <img src={require('assets/media/brand/logo.png')} alt={config.title} />
    </Isvg>
    <Isvg className="app__logo__icon" src={require('assets/media/brand/icon.svg')}>
      <img src={require('assets/media/brand/icon.png')} alt={config.title} />
    </Isvg>
  </div>);

export default Logo;
