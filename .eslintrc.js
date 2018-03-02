{
  "parser": "babel-eslint",
  "extends": ["standard", "standard-react", "plugin:es-beautifier/standard"],
  "plugins": ["babel", "react", "promise", "es-beautifier"],
  "env": {
    "browser": true
  },
  "globals": {
    "__DEV__": false,
    "__TEST__": false,
    "__PROD__": false,
    "__COVERAGE__": false
  },
  "rules": {
    "key-spacing": "off",
    "jsx-quotes": [2, "prefer-single"],
    "max-len": [2, 80, 2],
    "object-curly-spacing": [2, "always"],
    "comma-dangle": "off"
  }
}
