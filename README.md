# redux-formo

[![Build Status](https://travis-ci.org/jameslnewell/redux-formo.svg)](https://travis-ci.org/jameslnewell/redux-formo)

An alternate forms framework for Redux+React.

## Why not `redux-form`?

- validate on blur, not change
- validate individual fields, not the whole form

## Installation

    npm install --save redux-formo

## Usage

`createStore.js`

```javascript
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {reducer} from 'redux-formo';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
export createStoreWithMiddleware(combineReducers({
  form: reducer
}));
```

`App.jsx`

```javascript
import React from 'react';
import form from 'redux-formo';
import filter from './filter';
import validate from './validate';
import submit from './submit';

class App extends React.Component {

  render() {
    const {
      valid,
      submitting,
      submitted,
      error,
      fields: {name, phone},
      onSubmit
    } = this.props;

    return (
      <form onSubmit={onSubmit}>

        {error && <p>{error}</p>}

        <div>
          <label>
            Name: <input {...name}/>
          </label>
          {name.error && <p>{name.error}</p>}
        </div>

        <br/>

        <div>
          <label>
            Phone: <input {...phone}/>
          </label>
          {phone.error && <p>{phone.error}</p>}
        </div>

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
```


## Methods

### form(config, [mapStateToProps], [mapDispatchToProps], [mergeProps], [options])(Component)

Decorate a React Component, connecting the Redux form state and providing helper methods
 for handling form and field events e.g. `onSubmit()`, `onChange()`, `onBlur()`.

#### config : Object

##### .form : String

The name of the form.

Required.

##### .fields : Array<String>

The names of all the fields.

Required.

##### .values : Array<String>

The initial values of all the fields.

Optional.

##### .filter({field, value, values}) : String | Promise

A function used to filter a field value.

Optional.

Parameters:

- `field` - The name of the field being filtered
- `value` - The value of the field being filtered
- `values` - All the valid field values

Returns:

The filtered value.

##### .validate({field, value, values}) : Boolean | String | Promise

A function used to validate a field value.

Optional.

Parameters:

- `field` - The name of the field being filtered
- `value` - The value of the field being filtered
- `values` - All the valid field values

Returns:

True if the value is valid. An error string if the value is not valid.

##### .submit({dispatch, values}) : void | FSA | Promise

A function used to submit the field values.

Optional.

Parameters:

- `dispatch` - The dispatch method
- `values` - All the valid field values

Returns:

Void, a [Flux Standard Action](https://github.com/acdlite/flux-standard-action) or a Promise.


- if an error is thrown, the `error` property will be set and the form will not be marked as `submitted`
- if a FSA error is returned, the `error` property will be set and the form will not be marked as `submitted`
- if a promise is returned:
  - if the promise is rejected, the `error` property will be set and the form will not be marked as `submitted`
  - if the promise resolves a FSA error, the `error` property will be set and the form will not be marked as `submitted`
- in all other cases, the form will be marked as `submitted`

##### .filterOnChange : Boolean

Whether a field should be filtered when the field value changes.

Optional. Defaults to `false`.

##### .validateOnChange : Boolean

Whether a field should be validated when the field value changes.

Optional. Defaults to `false`.

##### .filterOnBlur : Boolean

Whether a field should be filtered when the field loses focus.

Optional. Defaults to `true`.

##### .validateOnBlur : Boolean

Whether a field should be validated when the field loses focus.

Optional. Defaults to `true`.

##### .filterOnSubmit : Boolean

Whether a field should be filtered when the form is submitted.

Optional. Defaults to `true`.

##### .validateOnSubmit : Boolean

Whether a field should be validated when the form is submitted.

Optional. Defaults to `true`.

##### .formStateKey : String

The name of the property where the form reducer is mounted on the state.

Optional. Defaults to `form`.

##### .formPropKey : String

The name of the property where the form state is passed in props to the react component.

Optional. Defaults to none.

#### mapStateToProps(state, ownProps) : Object

See the [`react-redux` documentation on the `connect` function](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).

Optional.

#### mapDispatchToProps(dispatch, ownProps) : Object

See the [`react-redux` documentation on the `connect` function](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).

Optional.

#### mergeProps(stateProps, dispatchProps, ownProps) : Object

See the [`react-redux` documentation on the `connect` function](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).

Optional.

#### options : Object

See the [`react-redux` documentation on the `connect` function](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).

Optional.

## Props

The decorated component will receive the following props:

- **filtering** : `bool` - whether one or more values are currently being filtered
- **validating** : `bool` - whether one or more values are currently being validated
- **submitting** : `bool` - whether the form is currently being submitted
- **submitted** : `bool` - whether the form has been submitted one or more times
- **error** : `string` - the error message from the last failed submission
- **valid** : `bool` - whether all the field values are valid
- **fields** : `object`
    - **&lt;name&gt;** - `object`
        - **name** - `string` - the name of the field
        - **active** - `bool` - whether the field is currently active (i.e. focussed)
        - **filtering** - `bool` - whether the filter function is currently running on the field
        - **filtered** - `bool` - whether the field has been filtered one or more times since the store was created
        - **validating** - `bool` - whether the validation function is currently running on the field
        - **validated** - `bool` - whether the field has been validated one or more times since the store was created
        - **error** - `string` - the error message from the previous validation
        - **valid** - `bool` - whether the current value is valid
        - **validValue** `string` - the the last successfully validated value
        - **value** - `string` - the current value
        - **checked** - `bool` - true when the value is not empty (for use with checkboxes)

## CHANGE LOG

### v1.1.0

- added `filterOnChange` and `validateOnChange` properties to allow configuration of whether validation occurs
 each time the user changes the value of a field
- An un-documented function, `afterValidate()`, is called after validation of each is complete - may change in the future!
- refactored `decorate.jsx` to make it more testable

### v1.0.0
- *breaking change:* The name of the package has changed from `the-other-redux-form` to `redux-formo`
- *breaking change:* The form state is now merged into the root of your component's props unless configured by `formPropKey`
- *breaking change:* The `filter`, `validate` and `submit` methods now receive an object instead of numerous parameters
- *possible breaking change:* The `filter`, `validate` and `submit` methods receive an object containing most recent
 valid values instead of the current values
- *possible breaking change:* For compatibility with packages that adhere to
 [Flux Standard Action](https://github.com/acdlite/flux-standard-action) (e.g. [`redux-promise`](https://www.npmjs.com/package/redux-promise)),
 if the `submit` method returns/resolves a FSA error the form submission will be assumed to have failed
- The `filter` and `validate` methods can return a promise, like the `submit` method, in order to perform asynchronous
 filtration and validation
- Added unit tests for most methods

## THANKS

Much of this package is inspired by `redux-form` by `erikras`. Much thanks!