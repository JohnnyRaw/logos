import React from 'react';
import { autobind } from 'core-decorators';
import { shouldComponentUpdate, trackEvent } from 'utils/helpers';

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.imagePath = `${location.origin}/logos/`;
    this.state = {
      path: location.hostname === 'localhost' ? '../logos/' : 'http://svgporn.com/logos/'
    };
  }

  static propTypes = {
    data: React.PropTypes.object.isRequired,
    handleClickTag: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired
  };

  shouldComponentUpdate = shouldComponentUpdate;

  @autobind
  onClickItem(e) {
    trackEvent('logo', 'click', e.currentTarget.dataset.shortname);
  }

  render() {
    const { data, handleClickTag, index } = this.props;
    return (
      <li>
        <a
          href={data.url}
          target="_blank"
          className="app__images__img"
          data-shortname={data.shortname}
          onClick={this.onClickItem}>
          <img src={`${this.imagePath}${data.files[index]}`} alt={data.name} className={data.shortname} />
        </a>

        <div className="app__images__info">
          <h5><a href={data.url} target="_blank">{data.name}</a></h5>

          <div className="app__images__tags">{
            data.tags.map((t, i) =>
              (<a key={i} href="#tag" onClick={handleClickTag} data-name={t}>#{t}</a>)
            )
          }</div>
          <div className="app__images__download">
            <a
              href={`${this.imagePath}${data.files[index]}`}
              className="btn btn-sm btn-outline-secondary btn-icon"
              download={true}>
              <i className="i-download" />
              <span>download</span>
            </a>
          </div>
        </div>
      </li>
    );
  }
}

export default Item;
