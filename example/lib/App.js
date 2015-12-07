import React from 'react';
import classNames from 'classnames';
import form from '../../index';
import filter from './filter';
import validate from './validate';
import submit from './submit';

class App extends React.Component {

  render() {
    const {
      valid,
      error,
      submitting,
      submitted,
      onSubmit,
      fields: {name, phone}
    } = this.props;

    const formClassNames = classNames(
      'form',
      {
        'form--valid': valid,
        'form--invalid': !valid
      }
    );

    return (
      <form className={formClassNames} onSubmit={onSubmit}>

        <h1>About You</h1>

        {error && <p className="control__error">{error}</p>}

        {name.active && 'Valid value: ' + name.validValue + ' Value: ' + name.value}
        <div className="control">
          <label className="control__label">
            Name: <input className="control__input" {...name}/>
          </label>
          {name.error ? <p className="control__error">{name.error}</p> : null}
        </div>

        <br/>
        <br/>

        {phone.active && 'Valid value: ' + phone.validValue + ' Value: ' + phone.value}
        <div className="control">
          <label className="control__label">
            Phone: <input className="control__input" {...phone}/>
          </label>
          {phone.error && <p className="control__error">{phone.error}</p>}
        </div>

        <br/>
        <br/>

        <input
          type="submit"
          value={submitted ? 'Saved.' : (submitting ? 'Saving...' : 'Save')}
          disabled={submitting || submitted}
        />

      </form>
    );
  }

}

export default form({
  form: 'personal-details',
  fields: ['name', 'phone'],
  filter, validate, submit
})(App);