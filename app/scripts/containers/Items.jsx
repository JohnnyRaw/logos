import React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import cx from 'classnames';
import _reduce from 'lodash/reduce';
import _sortBy from 'lodash/sortBy';
import Waypoint from 'react-waypoint';
import { shouldComponentUpdate, trackEvent } from 'utils/helpers';

import { filterItems } from 'actions';
import Loader from 'components/Loader';
import Toolbar from 'components/Toolbar';
import Item from 'components/Item';

@autobind
export class Items extends React.Component {
  constructor(props) {
    super(props);

    this.imagePath = `${location.origin}/logos/`;
    this.state = {
      limit: 50,
      logos: [],
      page: 1,
      scrollable: false
    };
  }

  static propTypes = {
    app: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    firebase: React.PropTypes.object.isRequired
  };

  shouldComponentUpdate = shouldComponentUpdate;

  componentWillMount() {
    if (this.props.firebase.ready) {
      this.setProperties();
      this.setLogos();
    }
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyboard);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    const { app: { filter: prevFilter }, firebase: prevData } = this.props;
    const { app: { filter }, firebase } = nextProps;

    if (!prevData.ready && firebase.ready) {
      this.setProperties();
      this.setLogos();
      return;
    }

    if (prevFilter.view !== filter.view || filter.tag || filter.category || filter.search) {
      this.setState({
        page: 1
      }, this.setLogos);
    }

    if (filter.showTags) {
      document.body.style.overflow = 'hidden';
    }
    else if (prevFilter.showTags && !filter.showTags) {
      document.body.style.overflow = 'auto';
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.body.removeEventListener('keydown', this.handleKeyboard);
  }

  setProperties() {
    const { categories, tags } = this.props.firebase;
    this.tags = _reduce(tags.children, (res, val) => {
      res[val.name] = val.count;
      return res;
    }, {});

    this.categories = _reduce(categories.children, (res, val) => {
      res[val.name] = val.count;
      return res;
    }, {});
  }

  setLogos() {
    const { app: { filter }, firebase } = this.props;
    let logos;

    switch (filter.view) {
      case 'favorites': {
        logos = _sortBy([...firebase.logos.children], d => d.shortname).filter(d => d.favorite);
        break;
      }
      case 'vectorized': {
        logos = _sortBy([...firebase.logos.children], d => d.shortname).filter(d => d.vectorized);
        break;
      }
      case 'all': {
        logos = _sortBy([...firebase.logos.children], d => d.shortname);
        break;
      }
      default: {
        logos = [...firebase.logos.children];
        break;
      }
    }

    if (filter.tag) {
      logos = logos.filter(d => d.tags.includes(filter.tag));
    }
    else if (filter.category) {
      logos = logos.filter(d => d.categories.includes(filter.category));
    }
    else if (filter.search) {
      logos = logos.filter(d => d.name.includes(filter.search) || d.shortname.includes(filter.search));
    }

    this.setState({
      logos
    });
  }

  scrollTo(element = document.body, to = 0, duration = document.body.scrollTop) {
    const newDuration = duration / 10 < 500 ? duration : 500;

    const difference = to - element.scrollTop;
    const perTick = difference / (duration * 10);
    let timeout;

    if (newDuration < 0) {
      clearTimeout(timeout);
      return;
    }

    timeout = setTimeout(() => {
      element.scrollTop += perTick;

      if (element.scrollTop === to) {
        clearTimeout(timeout);
      }
      this.scrollTo(element, to, newDuration - 10);
    }, 10);
  }

  scrollTop(e) {
    e.preventDefault();

    this.scrollTo(document.body, 0, window.scrollY / 10 < 500 ? window.scrollY / 10 : 500);
    trackEvent('scroll', 'click');
  }

  handleScroll(e) {
    const { app: { filter } } = this.props;
    if ((document.body.scrollTop >= 1000 && document.body.clientHeight > 4000) && !filter.showTags && !this.state.scrollable) {
      this.setState({
        scrollable: true
      });
    }
    else if (e.target.body.scrollTop < 1000 && this.state.scrollable) {
      this.setState({
        scrollable: false
      });
    }
  }

  handleChangeColumns(num) {
    this.props.dispatch(filterItems({ columns: num }));
  }

  handleKeyboard(e) {
    const { app: { filter } } = this.props;
    const intKey = (window.Event) ? e.which : e.keyCode;
    let action;

    if ((intKey === 189 || intKey === 109) && filter.columns > 1) {
      this.handleChangeColumns(filter.columns - 1);
      action = 'column-down';
    }

    if ((intKey === 187 || intKey === 107) && filter.columns < 5) {
      this.handleChangeColumns(filter.columns + 1);
      action = 'column-up';
    }
    if (intKey === 27) {
      if (filter.showTags) {
        this.props.dispatch(filterItems({ showTags: false }));
      }

      action = 'escape';
    }

    if (action) {
      trackEvent('keyboard', 'press', action);
    }
  }

  handleClickTag(e) {
    e.preventDefault();
    e.stopPropagation();

    const { name } = e.currentTarget.dataset;
    this.scrollTo(document.body, 0, window.scrollY / 10 < 500 ? window.scrollY / 10 : 500);

    this.props.dispatch(filterItems({ tag: name }));
    trackEvent('tag', 'info', name);
  }

  handleWaypoint() {
    this.setState({
      page: this.state.page + 1
    });
  }

  renderWaypoint() {
    const { limit, logos, page } = this.state;

    if (page * limit > logos.length) {
      return false;
    }

    return (<Waypoint bottomOffset="-90%" fireOnRapidScroll={false} onEnter={this.handleWaypoint} />);
  }

  render() {
    const { app, firebase, dispatch } = this.props;
    const { limit, logos, page } = this.state;
    const options = {
      empty: false,
      hidden: []
    };
    const output = {
      items: (<Loader />)
    };

    if (firebase.ready) {
      const items = logos.slice(0, limit * page).map(d =>
        d.files.map((f, i) =>
          (<Item key={`${d.id}-${i}`} handleClickTag={this.handleClickTag} data={d} index={i} />)
        )
      );

      output.toolbar = (
        <Toolbar
          app={app}
          firebase={firebase}
          dispatch={dispatch}
          handleClickTag={this.handleClickTag}
          handleChangeColumns={this.handleChangeColumns} />);

      output.logos = (
        <ul
          className={cx(`app__images col-${app.filter.columns}`, {
            empty: options.empty
          })}>
          {items}
        </ul>
      );
    }
    return (
      <div key="Items" className="app__items app__route">
        {output.toolbar}
        {output.logos}
        {this.renderWaypoint()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
    firebase: state.firebase
  };
}

export default connect(mapStateToProps)(Items);
