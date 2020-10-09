module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'vue/v-on-style': 'off',
    'vue/v-bind-style': 'off',
    'vue/no-v-html': 'off',
    'max-len': 'off',
    'no-console': 'off',
    'no-useless-escape': 'off',
  },
};
