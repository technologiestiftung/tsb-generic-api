const AWS = require('aws-sdk');

module.exports = class Upload {
  constructor(db, config) {
    this.db = db;
    this.url = `https://s3-${config.region}.amazonaws.com/${config.bucket}/`;

    AWS.config.update({
      region: config.region,
    });

    this.S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {
        Bucket: config.bucket,
      },
    });
  }

  uploadFile({
    filename,
    file,
    mime,
  }) {
    return this.S3.upload({
      Key: `${filename}`,
      Body: file,
      ACL: 'public-read',
      ContentType: mime,
    }).promise();
  }

  create({
    path,
    url = `${this.url}${path}`,
    type,
    source,
    description,
  }) {
    return this.db.create({
      path,
      url,
      type,
      source,
      description,
    });
  }

  findById(_id) {
    return this.db.findById(_id);
  }

  update(_id, attributes) {
    return this.db.findByIdAndUpdate(_id, attributes, { new: true });
  }

  deleteFile(path) {
    return this.S3.deleteObject({
      Key: path,
    }).promise();
  }

  remove(_id) {
    return this.db.findByIdAndDelete(_id);
  }
};
