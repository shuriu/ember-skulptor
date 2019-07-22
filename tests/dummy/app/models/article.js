import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  title: validator('presence', true),
  body:  validator('presence', true)
});

export default Model.extend(Validations, {
  title:      attr('string'),
  body:       attr('string'),
  published:  attr('boolean', { defaultValue: false })
})
