module.exports = class Controller {
  constructor(service) {
    this.service = service;
  }

  async create(request, h) {
    const {
      file,
      imageType,
      source,
      description,
    } = request.payload;
    const mime = file.hapi.headers['content-type'];

    const { key } = await this.service.uploadFile({
      filename: new request.server.mongoose.Types.ObjectId(),
      file,
      mime,
    });

    return this.service.create({
      path: key,
      type: imageType,
      source,
      description,
    });
  }

  async findById(request, h) {
    const { _id } = request.params;

    const res = await this.service.findById(_id);
    if (!res) return h.notFound();

    return res;
  }

  async update(request, h) {
    const { _id } = request.params;
    const { payload } = request;
    const res = await this.service.update(_id, payload);

    if (!res) return h.notFound();
    return res;
  }

  async remove(request, h) {
    const { _id } = request.params;
    const removed = await this.service.remove(_id);

    if (removed) {
      const { path } = removed;
      return this.service.deleteFile(path);
    }
    return h.notFound();
  }
};
