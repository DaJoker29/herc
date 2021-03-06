const mongoose = require('mongoose');
const token = require('random-token');
const shortid = require('shortid');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const authorSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      default: shortid.generate,
      unique: true
    },
    username: { type: String, required: true, unique: true, select: false },
    email: { type: String, required: true, select: false },
    displayName: { type: String, default: 'Keyser Soze' },
    token: { type: String, default: token(128), select: false },
    createdDate: { type: Date, default: Date.now(), select: false }
  },
  { versionKey: false }
);

authorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Author', authorSchema);
