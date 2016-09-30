import React from 'react';
import { autobind, debounce } from 'core-decorators';
import { shouldComponentUpdate, trackEvent } from 'utils/helpers';

import { goTo, filterItems } from 'actions';

import Logo from 'components/Logo';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ''
    };
  }

  static propTypes = {
    app: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  shouldComponentUpdate = shouldComponentUpdate;

  componentWillMount() {
    const { app: { filter } } = this.props;

    this.setState({
      search: filter.search
    });
  }

  componentWillReceiveProps(nextProps) {
    const { app: { filter: prevFilter } } = this.props;
    const { app: { filter } } = nextProps;

    if (prevFilter.search !== filter.search) {
      this.setState({
        search: filter.search
      });
    }
  }

  @autobind
  onClickLogo(e) {
    e.preventDefault();
    this.props.dispatch(goTo(e.currentTarget.getAttribute('href')));
  }

  @autobind
  handleSearch(e) {
    let search = '';

    if (e.type === 'click') {
      e.preventDefault();
      e.currentTarget.parentNode.previousSibling.focus();
    }
    else if (e.type === 'change') {
      search = e.target.value;
    }

    this.setState({ search });
    this.executeSearch(search);
  }

  @debounce(300)
  executeSearch(search) {
    this.props.dispatch(filterItems({ search }));

    if (search) {
      trackEvent('search', 'submit', search);
    }
  }

  render() {
    const { search } = this.state;
    const { app: { filter } } = this.props;

    return (
      <header className="app__header">
        <div className="app__container">
          <a href="/" className="app__header__logo" onClick={this.onClickLogo}>
            <Logo />
          </a>
          <div className="app__header__search">
            <input
              type="text"
              name="search"
              value={search}
              onChange={this.handleSearch} />
            <span className="input-icon">
              {filter.search ?
               (<a href="#clean" onClick={this.handleSearch}>
                 <i className="i-remove" />
               </a>)
                : <i className="i-search" />
              }
            </span>
          </div>

          <div className="app__header__social">
            <a href="https://twitter.com/intent/follow?screen_name=svgporn" target="_blank">
              <i className="i-twitter" />
            </a>
            <a href="https://www.facebook.com/svgporn" target="_blank">
              <i className="i-facebook" />
            </a>
          </div>
        </div>
      </header>
    );
  }
}
