const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  radius: { type: Number, required: true },
  color: { type: String, required: true },
  // Add other node properties from your spec here
});

const TimemapSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    default: 'Untitled Timemap'
  },
  nodes: [NodeSchema],
  forkedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timemap'
  },
  // Add other timemap properties here (e.g., connections, styles)
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Timemap', TimemapSchema);
