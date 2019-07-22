import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';
import { task, all, timeout } from 'ember-concurrency';

export default Component.extend({
  layout,
  tagName: 'form',

  didSubmit: computed('submitTask.performCount', function () {
    return this.submitTask.performCount != 0;
  }),

  // Defaults
  object: null,
  afterSubmitTimeout: 400,

  beforeSubmit() { },
  onSubmit() { },
  afterSubmit() { },

  submit(event) {
    event.preventDefault();
    this.submitTask.perform();
  },

  submitTask: task(function* () {
    let shouldContinue = yield this.beforeSubmit();

    if (shouldContinue) {
      yield all([
        this.onSubmit(),
        timeout(this.afterSubmitTimeout)
      ]);

      yield this.afterSubmit();
    }
  }).restartable()
});
