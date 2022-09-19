const mongoose = require("mongoose");

module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQnty = oldCart.totalQnty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function (item, _id) {
    var storedItem = this.items[_id];
    if (!storedItem) {
      storedItem = this.items[_id] = { item: item, qnty: 0, price: 0 };
    }
    storedItem.qnty++;
    storedItem.price = storedItem.item.price * storedItem.qnty;
    this.totalQnty++;
    this.totalPrice += storedItem.item.price;
  };

  this.generateArray = function () {
    var arr = [];
    for (var _id in this.items) {
      arr.push(this.items[_id]);
    }
    return arr;
  };
};
