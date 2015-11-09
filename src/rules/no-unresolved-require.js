/**
 * @fileOverview Ensures that an required path exists, given resolution rules.
 * @author Ben Mosher
 */
import resolve from '../core/resolve'

module.exports = function (context) {
  function checkSource(call) {
    if (call.callee.type !== 'Identifier') return
    if (call.callee.name !== 'require') return

    var requireArg = call.arguments[0];
    var modules;

    if (requireArg.type === 'ArrayExpression') {
      modules = requireArg.elements;
    } else {
      modules = [requireArg];
    }

    modules.forEach(function(module) {
      if (module.type !== 'Literal') return
      if (typeof module.value !== 'string') return

        if (resolve(module.value, context) == null) {
          context.report(module,
            'Unable to resolve path to module \'' + module.value + '\'.')
        }
    });
  }

  return {
    'CallExpression': checkSource
  }
}
