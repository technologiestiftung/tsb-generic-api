module.exports = (mongoose) => {
  const { Schema } = mongoose;

  const File = new Schema({
    url: { type: String, required: true },
    path: { type: String, required: true },
    type: { type: String, required: true },
    source: { type: String, maxLength: 100 },
    description: { type: String, maxLength: 100 },
  }, { timestamps: true, toJSON: { virtuals: true } });

  return mongoose.model('File', File);
};
