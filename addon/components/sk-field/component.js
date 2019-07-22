import Component from '@ember/component';
import layout from './template';
import { get, getWithDefault, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { isPresent, isBlank } from '@ember/utils';
import { decamelize } from '@ember/string';
import Ember from 'ember';
const { mixin } = Ember;

export default Component.extend({
  layout,

  // Defaults
  object: null,
  attribute: null,

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

  labelText: computed('attribute', function () {
    if (isBlank(this.attribute)) {
      return;
    }

    let string = decamelize(this.attribute);

    let result = string.toLowerCase().replace(/_+/g, ' ');
    return result.charAt(0).toUpperCase() + result.slice(1);
  })
});
