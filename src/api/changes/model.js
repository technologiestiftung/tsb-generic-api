module.exports = (mongoose) => {
  const { Schema } = mongoose;

  const Change = new Schema({
    meta: {
      create: { type: Boolean },
      type: {
        type: String,
        required: true,
      },
      target: {
        type: Schema.Types.ObjectId,
        refPath: 'meta.type',
        autopopulate: { maxDepth: 1 },
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true,
        required: true,
      },
    },
    data: Schema.Types.Mixed,
  }, { timestamps: true, toJSON: { virtuals: true } });

  return mongoose.model('Change', Change);
};
