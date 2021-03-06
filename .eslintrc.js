module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:compat/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    APP_TYPE: true,
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'import/no-unresolved': [2, { ignore: ['^@/', '^umi/'] }],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'linebreak-style': 0,
    // Kinfy
    'generator-star-spacing': [0],
    'consistent-return': [0], // 要求 return 语句要么总是指定返回的值，要么不指定
    'global-require': [1], // 要求 require() 出现在顶层模块作用域中
    'import/prefer-default-export': [0],
    'react/jsx-no-bind': [0],
    'react/prefer-stateless-function': [0],
    'no-else-return': [0],
    'no-restricted-syntax': [0],
    'import/no-extraneous-dependencies': [0],
    'no-use-before-define': [0],
    'no-nested-ternary': [0],
    'arrow-body-style': [0],
    'import/extensions': [0],
    'no-bitwise': [0],
    'no-cond-assign': [0],
    'object-curly-newline': [0],
    'function-paren-newline': [0],
    'no-restricted-globals': [0],
    'require-yield': [1],
    // 自己加的
    'react/jsx-boolean-value': [0],
    'react/no-danger': [0],
    'no-param-reassign': [0], //禁止重新分配函数参数
    'no-plusplus': [0],
    'no-extra-boolean-cast': [0],
    'react/destructuring-assignment':[0],
    // 'react/no-array-index-key':[0],
    // 'no-const-assign':[0],

  },
  settings: {
    polyfills: ['fetch', 'promises', 'url'],
  },
};
