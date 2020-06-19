function mxRectangle(width, height) {
  this.width = width;
  this.height = height;
}

mxRectangle.counter = 0;

mxRectangle.prototype.calcArea = function() {
  return this.height * this.width;
};

mxRectangle.prototype.calcPerimeter = function() {
  return 2 * (this.height + this.width);
};

mxRectangle.fromRectangle = function(width, height) {
  return new mxRectangle(width, height);
};
