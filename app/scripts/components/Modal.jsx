import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from 'store';

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: `modal-${Math.random()}`
    };
  }

  static propTypes = {
    animation: React.PropTypes.bool,
    backdrop: React.PropTypes.bool,
    blurify: React.PropTypes.bool,
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    onHide: React.PropTypes.func,
    onShow: React.PropTypes.func,
    show: React.PropTypes.bool,
    showFooter: React.PropTypes.bool,
    style: React.PropTypes.object,
    title: React.PropTypes.string
  };

  static defaultProps = {
    animation: true,
    backdrop: true,
    blurify: true,
    show: false,
    showFooter: false
  };

  componentDidMount() {
    let el = this.state.id && document.getElementById(this.state.id);

    if (!el) {
      el = document.createElement('div');
      el.id = this.state.id;
      document.body.appendChild(el);
    }

    this.foreignElement = el;
    this.initModal();
  }

  componentDidUpdate(prevProps) {
    this.renderModal();

    if (prevProps.show !== this.props.show) {
      this.toggleModal();
    }
  }

  componentWillUnmount() {
    this.$modal.modal('hide');
    const modal = document.getElementById(this.state.id);
    modal.parentNode.removeChild(modal);
  }

  toggleModal() {
    if (this.props.show) {
      this.$modal.modal('show');
    }
    else {
      this.$modal.modal('hide');
    }
  }

  initModal() {
    const { backdrop, blurify, onHide, onShow, show } = this.props;

    this.renderModal();
    let scrollable;
    this.$modal = $(this.foreignElement).find('.modal');

    this.$modal.modal({
      backdrop,
      show
    });

    this.$modal.on('show.bs.modal', () => {
      if (blurify) {
        $('body').addClass('blurify');
      }
    });

    this.$modal.on('shown.bs.modal', () => {
      const $modalBody = this.$modal.find('.modal-body');
      const $modalBodyWrapper = this.$modal.find('.modal-body__wrapper');

      if (typeof onShow === 'function') {
        onShow();
      }

      if ($modalBodyWrapper.find('> div').outerHeight() > $modalBodyWrapper.outerHeight()) {
        $modalBody.addClass('scrollable');
        scrollable = true;
      }
    });

    this.$modal.on('hidden.bs.modal', () => {
      if (typeof onHide === 'function') {
        onHide();
      }

      $('body').removeClass('blurify');
    });

    this.$modal.find('.modal-body__wrapper').on('scroll', e => {
      const $el = $(e.currentTarget);
      const scrollTop = $el.scrollTop() + $el.outerHeight();
      const innerHeight = $el.find('> div').height();
      const threshold = innerHeight - scrollTop;

      if (innerHeight > $el.height()) {
        if (threshold < 250 && scrollable) {
          scrollable = false;
          $el.parent().removeClass('scrollable');
        }
        else if (threshold > 250 && !scrollable) {
          scrollable = true;
          $el.parent().addClass('scrollable');
        }
      }
    });
  }

  renderModal() {
    const { animation, children, className, show, showFooter, style, title } = this.props;
    const opts = {
      modalClassName: ['modal']
    };

    if (animation) {
      opts.modalClassName = opts.modalClassName.concat('fade');
    }

    if (show) {
      opts.modalClassName = opts.modalClassName.concat('in');
    }

    if (className) {
      opts.modalClassName = opts.modalClassName.concat(className);
    }

    if (title) {
      opts.header = (
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 className="modal-title">{title}</h4>
        </div>
      );
    }

    if (showFooter) {
      opts.footer = (
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      );
    }

    ReactDOM.render(
      <Provider store={store}>
        <div className={opts.modalClassName.join(' ')} tabIndex="-1" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content" role="document" style={style}>
              {opts.header}
              <div className="modal-body">{children}</div>
              {opts.footer}
            </div>
          </div>
        </div>
      </Provider>, this.foreignElement);
  }

  render() {
    return false;
  }
}

export default Modal;
