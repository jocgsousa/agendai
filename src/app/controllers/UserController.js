import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      tel: Yup.string().required(),
      password: Yup.string().min(6).required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: ' Validation fails' });
    }
    const userExists = await User.findOne({
      where: {
        email: request.body.email,
      },
    });
    if (userExists) {
      return response.status(400).json({ error: 'Conta de e-mail já em uso' });
    }

    const { id, name, email } = await User.create(request.body);

    return response.status(201).json({
      id,
      name,
      email,
    });
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      tel: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
      comfirmPassword: Yup.string().min(6).when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),

    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: 'Validation fails' });
    }
    const { email, oldPassword } = request.body;
    const user = await User.findByPk(request.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: {
          email,
        },
      });
      if (userExists) {
        return response.status(401).json({ error: 'Conta de e-mail já em uso' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return response.status(401).json({ error: 'Senha atual inválida tente novamente!' });
    }

    const { id, name, tel } = await user.update(request.body);

    return response.json({
      id,
      name,
      email,
      tel,
    });
  }
}
export default new UserController();
