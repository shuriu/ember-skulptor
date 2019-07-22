'use strict';

module.exports = {
  extends: 'recommended',

  rules: {
    'quotes': 'single',
    'attribute-indentation': false,
    'no-nested-interactive': {
      ignoredTags: ['label']
    },
    // 'no-bare-strings': true
  }
};
