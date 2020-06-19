class mxRectangle {
  isShape = true;
  alternativeShape = new Object();
  color;

  constructor(width, height) {
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
