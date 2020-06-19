module.exports = function varToFunction({ types: t }) {
  return {
    name: 'VarToFunction',
    visitor: {
      VariableDeclaration(path) {
        if (
          t.isVariableDeclarator(path.node.declarations[0]) &&
          t.isFunctionExpression(path.node.declarations[0].init) &&
          t.isIdentifier(path.node.declarations[0].id) &&
          path.node.declarations[0].id.name.startsWith('mx')
        ) {
          const name = t.identifier(path.node.declarations[0].id.name);
          path.replaceWith(
            t.functionDeclaration(
              name,
              path.node.declarations[0].init.params,
              path.node.declarations[0].init.body
            )
          );
        }
      }
    }
  };
};
