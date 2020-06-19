function mxRectangle(x, y, width, height) {
  mxPoint.call(this, x, y);
  this.width = width;
  this.height = height;
}

mxUtils.extend(mxRectangle, mxPoint);

mxRectangle.prototype.calcArea = function() {
  return this.height * this.width;
};

mxRectangle.prototype.calcPerimeter = function() {
  return 2 * (this.height + this.width);
};
