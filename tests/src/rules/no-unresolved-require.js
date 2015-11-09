var path = require('path')

import { test } from '../utils'

import { RuleTester } from 'eslint'

var ruleTester = new RuleTester()
  , rule = require('../../../lib/rules/no-unresolved-require')

ruleTester.run('no-unresolved-require', rule, {
  valid: [
    test({ code: 'require("./bar");' }),
    test({ code: "require('fs');" }),
    test({ code: 'require(["./bar", "fs"]);' }),
    test({
      code: "require('in-alternate-root');",
      settings: {
        'import/resolve': {
          'paths': [path.join( process.cwd()
                             , 'tests', 'files', 'alternate-root')],
        },
      },
    }),
  ],

  invalid: [
    // should fail for jsx by default
    test({ code: 'require("jsx-module/foo")'
         , errors: [ {message: 'Unable to resolve path to ' +
                               'module \'jsx-module/foo\'.'} ],
         }),

    test({ code: 'require(["fs", "jsx-module/foo"])'
         , errors: [ {message: 'Unable to resolve path to ' +
                               'module \'jsx-module/foo\'.'} ],
         }),

    test({ code: 'require("./reallyfake/module")'
         , settings: { 'import/ignore': ['^\\./fake/'] }
         , errors: [{ message: 'Unable to resolve path to module ' +
                               '\'./reallyfake/module\'.' }],
         }),

    test({ code: 'require(["jsx-module/foo", "./reallyfake/module"])'
         , settings: { 'import/ignore': ['^\\./fake/'] }
         , errors: [{ message: 'Unable to resolve path to module ' +
                               '\'jsx-module/foo\'.' },
                    { message: 'Unable to resolve path to module ' +
                               '\'./reallyfake/module\'.' }],
         }),

    test({
      code: "require('./baz');",
      errors: [{ message: "Unable to resolve path to module './baz'."
               , type: 'Literal',
               }]}),
    test({
      code: "require('./empty-folder');",
      errors: [{ message: "Unable to resolve path to module './empty-folder'."
               , type: 'Literal',
               }]}),
  ],
})
