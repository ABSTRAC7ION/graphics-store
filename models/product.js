const mongoose = require("mongoose");
const mongooseAlgolia = require('mongoose-algolia');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  artist: { type: String },
  price: { type: Number, required: true },
  genre: { type: String, required: true },
  image: { type: String, required: true },
  likes: Number,
  date: Date,
});

productSchema.plugin(mongooseAlgolia, {
  appId: '48MTIZMRSA',
  apiKey: '92a07b76cb350b688fd971c89ceda9b7',
  indexName: 'search-engine',
  selector: 'name + genre + description + artist + image + price + likes',
  virtuals: {
    whatever: function (doc) {
      return `Custom data ${doc.title}`
    },
  },
  filter: function (doc) {
    return !doc.softdelete
  },
  debug: true,
})
let Model = mongoose.model("Product", productSchema);

Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
  searchableAttributes: ['genre', 'name', 'artist', 'description'],
})

module.exports = Model

