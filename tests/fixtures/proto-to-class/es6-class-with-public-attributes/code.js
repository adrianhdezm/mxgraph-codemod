function mxRectangle(width, height) {
  this.width = width;
  this.height = height;
}

mxRectangle.prototype.isShape = true;
mxRectangle.prototype.alternativeShape = new Object();
mxRectangle.prototype.color;

mxRectangle.prototype.calcArea = function() {
  return this.height * this.width;
};

mxRectangle.prototype.calcPerimeter = function() {
  return 2 * (this.height + this.width);
};
