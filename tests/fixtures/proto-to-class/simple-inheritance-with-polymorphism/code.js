function mxRectangle(x, y, width, height) {
  mxPoint.call(this, x, y);
  this.width = width;
  this.height = height;
}

mxUtils.extend(mxRectangle, mxPoint);

mxRectangle.prototype.getCoordinates = function() {
  // The method in the parent class is called
  if(this.x && this.y) {
    mxPoint.prototype.getCoordinates.apply(this, arguments);
  }
};

mxRectangle.prototype.setCoordinates = function(x, y) {
  // The method in the parent class is called
  mxPoint.prototype.setCoordinates.apply(this, arguments);
};

mxRectangle.prototype.calcArea = function() {
  return this.height * this.width;
};

mxRectangle.prototype.calcPerimeter = function() {
  return 2 * (this.height + this.width);
};
