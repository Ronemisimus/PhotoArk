module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'prettier/prettier': [
      'error',
      {
        'no-inline-styles': false,
      },
    ],
    'react/react-in-jsx-scope': 'off',
  },
};