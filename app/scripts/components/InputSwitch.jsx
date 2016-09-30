import React from 'react';
import classnames from 'classnames';

function InputSwitch(props) {
  const handleClick = () => {
    if (props.onChange) {
      props.onChange(!props.value);
    }
  };

  const className = classnames('u-switch', {
    'is-checked': props.value
  }, props.className);

  return (
    <div
      className={className}
      onClick={handleClick}>
      <input
        type="hidden"
        name={props.name}
        value={props.value} />
      <span className="track" />
      <span className="button" />
    </div>
  );
}

InputSwitch.defaultProps = {
  value: false
};

InputSwitch.propTypes = {
  className: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  value: React.PropTypes.bool.isRequired
};

export default InputSwitch;
