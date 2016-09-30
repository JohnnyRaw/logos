import React from 'react';
import { reduxForm, Field, startSubmit } from 'redux-form';
import { autobind } from 'core-decorators';
import cx from 'classnames';
import moment from 'moment';
import Multiselect from 'react-widgets/lib/Multiselect';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

import { shouldComponentUpdate } from 'utils/helpers';
import { diffArrays } from 'utils/data';
import { updateLogos } from 'actions';

import InputSwitch from 'components/InputSwitch';

momentLocalizer(moment);

@autobind()
export class FormItem extends React.Component {
  static propTypes = {
    categories: React.PropTypes.array.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    hideModal: React.PropTypes.func.isRequired,
    initialize: React.PropTypes.func.isRequired,
    invalid: React.PropTypes.bool.isRequired,
    item: React.PropTypes.object,
    pristine: React.PropTypes.bool.isRequired,
    reset: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool.isRequired,
    tags: React.PropTypes.array.isRequired
  };

  shouldComponentUpdate = shouldComponentUpdate;

  componentWillMount() {
    const { initialize, item } = this.props;

    initialize(item);
  }

  onSubmit(formData) {
    const { item, dispatch, reset, hideModal } = this.props;

    delete formData.id;
    formData.updated = moment(formData.updated).format('YYYY-MM-DD');

    const row = {
      id: item.id,
      item: formData
    };

    const diffTags = diffArrays(item.tags, formData.tags);
    if (diffTags) {
      row.tags = diffTags;
    }

    const diffCategories = diffArrays(item.categories, formData.categories);
    if (diffCategories) {
      row.categories = diffCategories;
    }

    dispatch(startSubmit('formItem'));

    return new Promise(resolve =>
      dispatch(updateLogos(row, () => {
        resolve();
        reset();
        hideModal();
      }))
    );
  }

  renderDateTimePicker({ input, label }) {
    const date = moment(input.value || new Date()).toDate();
    delete input.value;

    return (
      <div className="form-group">
        <label htmlFor={input.name}>{label}</label>
        <DateTimePicker
          {...input}
          onBlur={() => input.onBlur()}
          defaultValue={date}
          format="YYYY-MM-DD"
          time={false} />
      </div>
    );
  }

  renderMultiselect({ input, label, name, data }) {
    input.value = input.value || [];
    let tagComponent;

    if (name === 'files') {
      tagComponent = val => (<div><img src={`/logos/${val.item}`} alt={val.item} /></div>);
    }

    return (
      <div className="form-group">
        <label htmlFor={input.name}>{label}</label>
        <Multiselect
          {...input}
          onBlur={() => input.onBlur()}
          defaultValue={input.value || []} // requires value to be an array
          onCreate={val => input.onChange(input.value.concat(name === 'files' && !val.includes('.svg') ? `${val}.svg` : val))}
          tagComponent={tagComponent}
          name={name}
          data={data} />
      </div>);
  }

  renderInputSwitch({ input, label }) {
    return (
      <div className="form-group">
        <label htmlFor={input.name}>{label}</label>
        <InputSwitch {...input} />
      </div>
    );
  }

  renderField({ input, label, type, meta: { touched, error } }) {
    return (
      <div className="form-group">
        <label htmlFor={input.name}>{label}</label>
        <div>
          <input {...input} placeholder={label} type={type} className="form-control" />
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    );
  }

  render() {
    const { categories, handleSubmit, invalid, item, pristine, reset, submitting, tags } = this.props;

    return (
      <form className="app__form" onSubmit={handleSubmit(this.onSubmit)}>
        <h3>{item.id ? 'Edit Logo' : 'New Logo'}</h3>
        <Field
          name="name"
          label="Name"
          type="text"
          component={this.renderField} />
        <Field
          name="shortname"
          label="Shortname (unique)"
          type="text"
          component={this.renderField} />
        <Field
          name="url"
          label="URL"
          type="text"
          component={this.renderField} />
        <Field
          name="categories"
          label="Categories"
          component={this.renderMultiselect}
          data={categories} />
        <Field
          name="tags"
          label="Tags"
          component={this.renderMultiselect}
          data={tags} />
        <Field
          name="files"
          label="Files"
          component={this.renderMultiselect}
          data={item.files} />
        <Field
          name="updated"
          label="Updated"
          component={this.renderDateTimePicker} />

        <div className="row">
          <div className="col-xs-12 col-sm-4">
            <Field
              name="favorite"
              label="Favorite"
              component={this.renderInputSwitch} />
          </div>
          <div className="col-xs-12 col-sm-4">
            <Field
              name="edited"
              label="Edited"
              component={this.renderInputSwitch} />
          </div>
          <div className="col-xs-12 col-sm-4">
            <Field
              name="vectorized"
              label="Vectorized"
              component={this.renderInputSwitch} />
          </div>
        </div>

        <div className="app__form__actions">
          <button
            className="btn btn-primary btn-icon"
            type="submit"
            disabled={pristine || invalid || submitting}>
            <i
              className={cx({
                'i-paper-plane': !submitting,
                'i-circle-o-notch i-spin': submitting
              })} />
            <span>Save</span>
          </button>

          <button
            className="btn btn-outline-primary btn-icon"
            type="button"
            disabled={pristine}
            onClick={reset}>
            <i className="i-undo" />
            <span>Reset</span>
          </button>
        </div>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Required';
  }
  else if (!values.shortname) {
    errors.shortname = 'Required';
  }
  else if (!values.url) {
    errors.url = 'Required';
  }
  else if (!values.categories.length) {
    errors.categories = 'Required';
  }
  else if (!values.tags.length) {
    errors.tags = 'Required';
  }
  else if (!values.files.length) {
    errors.files = 'Required';
  }
  else if (!values.updated) {
    errors.updated = 'Required';
  }
  else if (values.favorite === undefined) {
    errors.favorite = 'Required';
  }
  else if (values.edited === undefined) {
    errors.edited = 'Required';
  }
  else if (values.vectorized === undefined) {
    errors.vectorized = 'Required';
  }

  return errors;
};

export default reduxForm({
  form: 'formItem',
  validate
})(FormItem);
