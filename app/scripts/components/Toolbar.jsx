import React from 'react';
import { autobind } from 'core-decorators';
import cx from 'classnames';
import { shouldComponentUpdate, trackEvent, ScaleLog } from 'utils/helpers';

import { filterItems } from 'actions';

import Combobox from 'react-widgets/lib/Combobox';

@autobind
export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.viewTypes = {
      all: 'All Logos',
      favorites: 'Favorites',
      latest: 'Latest',
      vectorized: 'Vectorized',
    };
    this.state = {
      category: 'Categories'
    };
  }

  static propTypes = {
    app: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    firebase: React.PropTypes.object.isRequired,
    handleChangeColumns: React.PropTypes.func.isRequired,
    handleClickTag: React.PropTypes.func.isRequired
  };

  shouldComponentUpdate = shouldComponentUpdate;

  componentWillMount() {
    const { app: { filter }, firebase: { tags } } = this.props;
    const fScale = {
      min: 1,
      max: 0,
      unit: 'rem',
      maxSize: 4
    };

    tags.children.forEach(t => {
      if (t.count < fScale.min) {
        fScale.min = t.count;
      }

      if (t.count > fScale.max) {
        fScale.max = t.count;
      }
    });

    this.setState({
      category: filter.category || 'Categories',
      fontScale: new ScaleLog(fScale)
    });
  }

  componentWillReceiveProps(nextProps) {
    const { app: { filter: prevFilter } } = this.props;
    const { app: { filter } } = nextProps;
    const newState = {};

    if (prevFilter.category !== filter.category) {
      newState.category = filter.category || 'Categories';
    }

    this.setState(newState);
  }

  handleSelectCategory(data) {
    this.props.dispatch(filterItems({ category: data.name !== 'Categories' ? data.name : '' }));

    trackEvent('category', 'click', data.name);
  }

  handleClickTags(e) {
    const { app: { filter }, dispatch } = this.props;
    if (e) {
      e.preventDefault();
    }

    dispatch(filterItems({
      showTags: !filter.showTags
    }));

    if (!filter.showTags) {
      trackEvent('tag-cloud', 'show');
    }
  }

  handleClickColumns(e) {
    e.preventDefault();
    const { app: { filter }, handleChangeColumns } = this.props;

    const col = Number(e.currentTarget.dataset.column);

    handleChangeColumns(filter.columns + col);
  }

  handleClickChangeView(e) {
    e.preventDefault();

    const { value } = e.currentTarget.dataset;

    this.props.dispatch(filterItems({ view: value }));
    trackEvent('view', 'click', value);
  }

  handleCleanFilter(e) {
    e.preventDefault();
    const { app: { filter }, dispatch } = this.props;

    dispatch(filterItems({ columns: filter.columns }));
  }

  render() {
    const { category } = this.state;
    const {
      app: { filter },
      firebase: {
        tags,
        categories
      },
      handleClickTag
    } = this.props;
    const output = {};
    let classes;

    const categoriesMenu = [{ name: 'Categories', count: 0 }].concat(categories.children);

    output.tagsMenu = (
      <li className="app__toolbar__tags">
        <a
          href="#tags"
          className={cx('btn btn-primary btn-icon', { tagged: filter.tag })}
          onClick={this.handleClickTags}>
          <i className="i-tags" /><span>Tags</span>
        </a>
      </li>
    );

    output.tagCloud = (
      <div className={cx('app__toolbar__cloud', { visible: filter.showTags })} onClick={this.handleClickTags}>
        <div className="app__toolbar__cloud__wrapper">
          {tags.children.map(d => {
            switch (Math.min(Math.ceil(d.count < 5 ? 0 : d.count / 10), 5)) {
              case 5:
                classes = 'tag-size-5';
                break;

              case 4:
                classes = 'tag-size-4';
                break;

              case 3:
                classes = 'tag-size-3';
                break;

              case 2:
                classes = 'tag-size-2';
                break;

              case 1:
                classes = 'tag-size-1';
                break;

              default:
                classes = 'tag-size-0';
                break;
            }

            return (
              <a
                key={d.id}
                href="#tag"
                className={classes}
                data-name={d.name}
                onClick={handleClickTag}>
                {`#${d.name} (${d.count})`}
              </a>
            );
          })}
        </div>
      </div>
    );

    output.categories = (
      <li className="app__toolbar__categories">
        <Combobox
          valueField="name"
          textField={d => (typeof d === 'string' ? d : `${d.name}${d.count ? ` (${d.count})` : ''}`)}
          suggest={true}
          data={categoriesMenu}
          value={category}
          onChange={this.handleSelectCategory} />
      </li>
    );

    output.title = this.viewTypes[filter.view];

    if (filter.category) {
      output.title = `[${filter.category}]`;
    }
    else if (filter.tag) {
      output.title = `#${filter.tag}`;
    }
    else if (filter.search) {
      output.title = `results for: ${filter.search}`;
    }

    return (
      <div className="app__toolbar">
        <div className="app__toolbar__heading">
          <h1>
            <span>{output.title}</span>
            <a href="#remove" onClick={this.handleCleanFilter}><i className="i-times-circle" /></a>
          </h1>
          <div className="app__toolbar__groups btn-group btn-group-sm">
            {Object.keys(this.viewTypes)
              .filter(f => f !== filter.view)
              .map(t =>
                (<a
                  key={t}
                  href={`#${t}`}
                  className="btn btn-secondary"
                  data-value={t}
                  onClick={this.handleClickChangeView}>
                  {this.viewTypes[t]}
                </a>)
              )}
          </div>
        </div>
        <ul className="app__toolbar__menu">
          {output.categories}
          {output.tagsMenu}
          <li className="app__toolbar__columns">
            <div className="app__toolbar__switch">
              <a
                href="#switch-down"
                className={cx({ disabled: filter.columns < 2 })}
                data-column="-1"
                onClick={this.handleClickColumns}>
                <i className="i-minus" />
              </a>
              <a
                href="#switch-down"
                className={cx({ disabled: filter.columns > (window.innerWidth > 880 ? 4 : 2) })}
                data-column="1"
                onClick={this.handleClickColumns}>
                <i className="i-plus" />
              </a>
            </div>
            <div className="keyboard">or use your keyboard</div>
          </li>
        </ul>
        {output.tagCloud}
      </div>
    );
  }
}
