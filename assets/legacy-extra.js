(function () {
  if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.ellipse) {
    CanvasRenderingContext2D.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
      this.save();
      this.translate(x, y);
      this.rotate(rotation || 0);
      this.scale(radiusX, radiusY);
      this.arc(0, 0, 1, startAngle, endAngle, !!anticlockwise);
      this.restore();
    };
  }

  if (typeof NodeList !== 'undefined' && NodeList.prototype && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      Array.prototype.forEach.call(this, callback, thisArg);
    };
  }

  if (typeof Element !== 'undefined' && Element.prototype && !Element.prototype.remove) {
    Element.prototype.remove = function () {
      if (this.parentNode) this.parentNode.removeChild(this);
    };
  }
})();
