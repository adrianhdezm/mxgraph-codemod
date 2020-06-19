class mxRectangle extends mxPoint {
  constructor(x, y, width, height) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  calcArea() {
    return this.height * this.width;
  }

  calcPerimeter() {
    return 2 * (this.height + this.width);
  }
}
