import Component from '@ember/component';
import layout from './template';
import { get, getWithDefault, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { isPresent, isBlank } from '@ember/utils';
import { decamelize, dasherize } from '@ember/string';
import Ember from 'ember';
const { mixin } = Ember;

export default Component.extend({
  layout,

  // Defaults
  object: null,
  attribute: null,
  labelText: null,
  placeholderText: null,

  init() {
    this._super(...arguments);

    let errorsPath = `object.validations.attrs.${this.attribute}.message`;

    mixin(this, {
      errorMessage: computed(errorsPath, function () {
        return get(this, errorsPath);
      })
    });
  },

  isInvalid: computed('didSubmit', 'errorMessage', function () {
    return this.didSubmit && isPresent(this.errorMessage);
  }),

  id: computed('attribute', function () {
    return `${this.attribute}-${guidFor(this)}`;
  }),

  name: computed('object', 'attribute', function () {
    if (isBlank(this.object) || isBlank(this.attribute)) {
      return;
    }

    let containerKey = getWithDefault(this.object, '_debugContainerKey', '').split(':')[1];

    if (isPresent(containerKey)) {
      return `${containerKey}[${this.attribute}]`;
    } else {
      return this.attribute;
    }
  }),

  required: computed('object', 'attribute', function () {
    if (isBlank(this.attribute) || isBlank(this.object)) {
      return false;
    }

    let presenceValidatorPath = `validations.attrs.${this.attribute}.options.presence.presence`;
    return this.object.get(presenceValidatorPath);
  }),

  disabled: computed('isSubmitting', function () {
    return this.isSubmitting;
  }),

  labelValue: computed('attribute', 'labelText', function () {
    if (isPresent(this.labelText)) {
      return this.labelText;
    }

    if (isBlank(this.attribute)) {
      return;
    }

    let string = decamelize(this.attribute);

    let result = string.toLowerCase().replace(/_+/g, ' ');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }),

  placeholderValue: computed('placeholderText', 'labelValue', 'required', function () {
    if (isPresent(this.placeholderText)) {
      return this.placeholderText;
    } else {
      let requiredLabel = '';

      if (this.required) {
        requiredLabel = '(required)';
      }

      return `${this.labelValue} ${requiredLabel}`;
    }
  }),

  autocompleteValue: computed('autocomplete', 'attribute', function () {
    if (isPresent(this.autocomplete)) {
      return this.autocomplete;
    } else {
      // TODO: Note create an array of valid autocomplete values from MDN:
      //  https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#Values
      //
      //  Then test that the attribute is included in that list. If it's not included
      //  just return 'on' by default.
      return dasherize(this.attribute);
    }
  })
});
