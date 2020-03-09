const bcrypt = require('bcrypt');

module.exports = (mongoose) => {
  const { Schema, model } = mongoose;

  const User = new Schema({
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: { unique: true },
    },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    blocked: { type: Boolean, default: true },
    createdAt: { type: Date },
    role: { type: String, enum: ['ADMIN', 'USER'] },
    institutions: [{
      type: Schema.Types.ObjectId,
      ref: 'institutions',
      autopopulate: false,
    }],
    venues: [{
      type: Schema.Types.ObjectId,
      ref: 'venues',
      autopopulate: false,
    }],
    events: [{
      type: Schema.Types.ObjectId,
      ref: 'events',
      autopopulate: false,
    }],
    meta: {
      name: { type: String, required: true },
      institutionName: { type: String, required: true },
      contactEmail: { type: String, required: true },
      phone: { type: String, required: true },
    },
  }, { timestamps: true, toJSON: { virtuals: true } });

  User.pre('save', function hashPassword(next) {
    const user = this;

    if (user.password && user.isModified('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    }

    next();
  });

  User.pre('findOneAndUpdate', async function hashPassword() {
    const doc = await this.model.findById(this._conditions._id);
    if (doc && this._update.password) {
      try {
        this._update.password = bcrypt.hashSync(this._update.password, bcrypt.genSaltSync(8));
      } catch (err) {
        delete this._update.password;
      }
    }
  });


  User.methods.comparePassword = async function comparePassword(password) {
    return bcrypt.compare(password, this.password);
  };

  const Token = new Schema({
    token: { type: String },
  }, { timestamps: true });

  return {
    User: model('User', User),
    Token: model('Token', Token),
  };
};
