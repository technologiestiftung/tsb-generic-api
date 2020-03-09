module.exports = class Controller {
  constructor(service) {
    this.service = service;
  }

  find(request, h) {
    const {
      limit = 10,
      skip = 0,
      sort = 'name',
      order = 'ascend',
      fields,
      ...filters
    } = request.query;

    return this.service.find(filters, {
      limit,
      skip,
      sort,
      order,
      fields,
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
    const res = await this.service.remove(_id);

    if (!res) return h.notFound();
    return res;
  }

  async signup(request, h) {
    const { email, password, meta } = request.payload;

    const user = await this.service.findByEmail(email);
    if (user) return h.badRequest('Already Registered');

    const verificationToken = request.generateToken(null, email);
    request.sendVerificationEmail(email, verificationToken);

    return this.service.create({
      email,
      password,
      meta,
    });
  }

  async resendConfirmationEmail(request, h) {
    const { email } = request.payload;

    const user = await this.service.findByEmail(email);
    if (!user) return h.unauthorized();
    if (user.verified) return h.badRequest();

    const verificationToken = request.generateToken(null, email);
    request.sendVerificationEmail(email, verificationToken);
    return { success: true };
  }

  async confirm(request, h) {
    const { email, token } = request.query;

    const user = await this.service.findByEmail(email);
    if (!user) return h.unauthorized();
    if (user.verified) return h.badRequest('User already verified');

    try {
      const { email: emailtoken } = request.verifyToken(token);
      if (!emailtoken || emailtoken !== email) return h.unauthorized();
    } catch (err) {
      return h.unauthorized();
    }

    user.verified = true;
    await user.save();

    return user;
  }

  async login(request, h) {
    const { email, password } = request.payload;

    const user = await this.service.findByEmail(email);
    if (!user) return h.unauthorized();

    if (!user.verified) return h.unauthorized('Please confirm your email address');
    if (user.blocked) return h.unauthorized('Your account has not been confirmed by an admin')

    const isValid = await user.comparePassword(password);
    if (!isValid) return h.unauthorized();

    const { _id, role, _doc } = user;
    const accessToken = request.generateToken(_id, email, role, 'access');
    const refreshToken = request.generateToken(_id, email, role, 'refresh', '1w');
    return {
      ..._doc,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(request, h) {
    const {
      token,
    } = request.query;

    try {
      const decoded = request.verifyToken(token);
      if (!decoded) return h.unauthorized();
      // TODO Blacklist tokens
      // const isBlacklisted = await this.service.checkBlacklist(token);
      // if (isBlacklisted) return h.unauthorized();

      const { _id, email, role } = decoded;
      const accessToken = request.generateToken(_id, email, role, 'access');
      return { accessToken };
    } catch (err) {
      return h.unauthorized();
    }
  }

  async passwordReset(request, h) {
    const { email } = request.payload;

    const user = await this.service.findByEmail(email);
    if (!user) return h.unauthorized();

    const { _id, role } = user;
    const passwordResetToken = request.generateToken(_id, email, role);
    request.sendResetPasswordEmail(email, passwordResetToken);

    return user;
  }

  async changePassword(request, h) {
    const { email, token, password } = request.payload;

    const user = await this.service.findByEmail(email);
    if (!user) return h.unauthorized();

    try {
      const { email: emailtoken } = request.verifyToken(token);
      if (!emailtoken || emailtoken !== email) return h.unauthorized();
    } catch (err) {
      return h.unauthorized();
    }

    user.password = password;
    await user.save();

    return user;
  }

  info(request, h) {
    const { email } = request.auth.credentials;
    const { populate } = request.query;
    return this.service.findByEmail(email, populate);
  }
};
