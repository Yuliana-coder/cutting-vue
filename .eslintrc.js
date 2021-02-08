module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ["@typescript-eslint", "smells", "filenames", "import"],
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".ts", ".js", ".jsx", ".json"]
      }
    },
    "import/extensions": [".js", ".jsx", ".mjs", ".ts", ".tsx"]
  },
  extends: [
    "plugin:vue/base",
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    "plugin:vue/recommended",

    "@vue/prettier",
    "@vue/typescript",

    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript"
  ],
  rules: {
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        mjs: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ],
    "import/no-duplicates": "error",

    "vue/no-v-html": "off",
    "vue/require-prop-types": "off",
    "vue/require-default-prop": "off",
    "vue/this-in-template": "error",
    "vue/no-restricted-syntax": "error",
    "vue/v-on-function-call": "error",
    "@typescript-eslint/no-unused-vars": "off",
    "filenames/match-regex": ["error", "^[a-z0-9_.-]+$", false],
    "no-console": process.env.NODE_ENV === "development" ? "warn" : "error",
    "no-debugger": 0,
    "no-alert": "off",
    "no-var": "error",
    "member-access": [true, "no-public"],
    "variable-name": [
      true,
      "ban-keywords",
      "check-format",
      "allow-pascal-case",
      "allow-leading-underscore",
      "allow-snake-case"
    ],
    quotemark: [true, "double"],
    "ordered-imports": false,
    "import-spacing": true,
    "object-literal-sort-keys": false,
    "no-consecutive-blank-lines": false,
    "no-trailing-whitespace": true,
    semicolon: [true, "always"],
    eofline: true,
    "trailing-comma": [
      true,
      {
        multiline: "always",
        singleline: "never"
      }
    ],
    "interface-name": false,
    whitespace: [
      true,
      "check-branch",
      "check-decl",
      "check-operator",
      "check-module",
      "check-separator",
      "check-rest-spread",
      "check-type",
      "check-type-operator"
    ],
    "smells/no-switch": "error",
    "smells/no-complex-switch-case": "error",
    "smells/no-setinterval": "error",
    "smells/no-this-assign": "off",
    "no-unexpected-multiline": "error",
    "no-return-assign": ["error", "always"]
  },
  parserOptions: {
    parser: "@typescript-eslint/parser"
  }
};
