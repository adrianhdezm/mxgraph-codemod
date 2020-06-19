module.exports = function protoToClass({ types: t }) {
  return {
    name: 'Prototype2Class',
    visitor: {
      FunctionDeclaration(path) {
        if (path.node.id.name.startsWith('mx')) {
          const className = path.node.id.name;
          const superClass = getSuperClass(path, t);

          if (superClass) {
            // Call to super in constructor
            path.traverse(addCallToSuperInConstructor, {
              superClass: superClass.name,
              t
            });
            // Call to super in methods
            path.parentPath.traverse(addCallToSuperInClassMethods, {
              superClassName: superClass.name,
              t
            });
          }

          path.replaceWith(
            t.classDeclaration(
              t.identifier(className),
              superClass,
              t.classBody([
                ...getClassProperties(
                  path,
                  className,
                  getPropertiesDefinedInConstructor(path.node.body.body, t),
                  t
                ),
                t.classMethod(
                  'constructor',
                  t.identifier('constructor'),
                  path.node.params,
                  path.node.body
                ),
                ...getClassMethods(path, className, t)
              ])
            )
          );

          path.parentPath.traverse(removePrototypeRelatedExpressions, {
            className,
            t
          });
        }
      }
    }
  };
};

const removePrototypeRelatedExpressions = {
  ExpressionStatement(path) {
    if (isCallToExtendMethod(path.node, this.className, this.t)) {
      path.remove();
    }

    if (isPrototypeDefinition(path.node, this.className, this.t)) {
      path.remove();
    }

    if (isPrototypeAssignment(path.node, this.className, this.t)) {
      path.remove();
    }

    if (isPrototypeOrphanDefinition(path.node, this.className, this.t)) {
      path.remove();
    }
  }
};

const addCallToSuperInConstructor = {
  CallExpression(path) {
    if (
      this.t.isIdentifier(path.node.callee.object, {
        name: this.superClass
      }) &&
      this.t.isIdentifier(path.node.callee.property, { name: 'call' })
    ) {
      path.replaceWith(
        this.t.callExpression(
          this.t.super(),
          path.node.arguments.filter((arg) => !this.t.isThisExpression(arg))
        )
      );
    }
  }
};

const addCallToSuperInClassMethods = {
  CallExpression(path) {
    if (
      this.t.isMemberExpression(path.node.callee.object) &&
      this.t.isMemberExpression(path.node.callee.object.object) &&
      this.t.isIdentifier(path.node.callee.object.object.object, {
        name: this.superClassName
      }) &&
      this.t.isIdentifier(path.node.callee.object.object.property, {
        name: 'prototype'
      })
    ) {
      const methodFunctionPath = path.findParent((p) => p.isFunctionExpression());
      const methodPath = methodFunctionPath.parentPath;
      const parentMethodName = path.node.callee.object.property.name;

      if (
        this.t.isMemberExpression(methodPath.node.left) &&
        methodPath.node.left.property.name === parentMethodName
      ) {
        path.replaceWith(
          this.t.expressionStatement(
            this.t.callExpression(
              this.t.memberExpression(this.t.super(), this.t.identifier(parentMethodName)),
              methodFunctionPath.node.params
            )
          )
        );
      }
    }
  }
};

function getSuperClass(path, t) {
  let superClass = null;

  path.node.body.body.forEach((item) => {
    if (
      t.isExpressionStatement(item) &&
      t.isCallExpression(item.expression) &&
      t.isIdentifier(item.expression.callee.property, {
        name: 'call'
      })
    ) {
      superClass = t.identifier(item.expression.callee.object.name);
    }
  });

  return superClass;
}

function getPropertiesDefinedInConstructor(nodes, t) {
  return nodes
    .filter(
      (node) =>
        t.isExpressionStatement(node) &&
        t.isAssignmentExpression(node.expression) &&
        t.isThisExpression(node.expression.left.object) &&
        t.isIdentifier(node.expression.left.property)
    )
    .map((node) => node.expression.left.property.name);
}

function getClassProperties(path, className, definedProperties, t) {
  return path.container
    .filter((node) => {
      let name;
      if (t.isAssignmentExpression(node.expression)) {
        name = node.expression.left.property.name;
      } else if (t.isMemberExpression(node.expression)) {
        name = node.expression.property.name;
      } else {
        return false;
      }
      return isProtoClassProperty(node, className, t) && !definedProperties.includes(name);
    })
    .map((node) => {
      const name = t.isAssignmentExpression(node.expression)
        ? node.expression.left.property.name
        : node.expression.property.name;

      const value = t.isAssignmentExpression(node.expression) ? node.expression.right : null;
      return t.classProperty(
        t.identifier(name),
        value,
        null,
        null,
        false,
        isStatic(node, className, t)
      );
    });
}

function getClassMethods(path, className, t) {
  return path.container
    .filter((node) => isProtoClassMethod(node, className, t))
    .map((node) => {
      return t.classMethod(
        'method',
        t.identifier(node.expression.left.property.name),
        node.expression.right.params,
        node.expression.right.body,
        false,
        isStatic(node, className, t)
      );
    });
}

function isProtoClassProperty(node, className, t) {
  return (
    isPrototypeOrphanDefinition(node, className, t) ||
    (isPrototypeAssignment(node, className, t) &&
      !isPrototypeDefinition(node, className, t) &&
      !t.isFunctionExpression(node.expression.right) &&
      !t.isIdentifier(node.expression.left.property, { name: 'constructor' }))
  );
}

function isProtoClassMethod(node, className, t) {
  return isPrototypeAssignment(node, className, t) && t.isFunctionExpression(node.expression.right);
}

function isCallToExtendMethod(node, className, t) {
  return (
    node &&
    t.isExpressionStatement(node) &&
    t.isCallExpression(node.expression) &&
    t.isIdentifier(node.expression.callee.property, { name: 'extend' }) &&
    t.isIdentifier(node.expression.arguments[0], { name: className })
  );
}

function isPrototypeDefinition(node, className, t) {
  return (
    node &&
    t.isExpressionStatement(node) &&
    t.isAssignmentExpression(node.expression) &&
    t.isIdentifier(node.expression.left.object, {
      name: className
    }) &&
    t.isIdentifier(node.expression.left.property, {
      name: 'prototype'
    }) &&
    t.isNewExpression(node.expression.right)
  );
}

function isPrototypeAssignment(node, className, t) {
  return (
    node &&
    t.isExpressionStatement(node) &&
    t.isAssignmentExpression(node.expression) &&
    (t.isIdentifier(node.expression.left.object, {
      name: className
    }) ||
      (t.isMemberExpression(node.expression.left.object) &&
        t.isIdentifier(node.expression.left.object.object, {
          name: className
        }) &&
        t.isIdentifier(node.expression.left.object.property, {
          name: 'prototype'
        })))
  );
}

function isPrototypeOrphanDefinition(node, className, t) {
  return (
    node &&
    t.isExpressionStatement(node) &&
    t.isMemberExpression(node.expression.object) &&
    t.isIdentifier(node.expression.object.object, {
      name: className
    }) &&
    t.isIdentifier(node.expression.object.property, {
      name: 'prototype'
    })
  );
}

function isStatic(node, className, t) {
  return (
    node &&
    t.isExpressionStatement(node) &&
    t.isAssignmentExpression(node.expression) &&
    t.isIdentifier(node.expression.left.object, { name: className })
  );
}
