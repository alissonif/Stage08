const { hash, compare } = require('bcryptjs');
const AppError = require("../utils/AppError");
const sqliteConnection = require('../database/sqlite');

class UsersControllers {

  async create(req, res) {
    const { name, email, password } = req.body;

    const hashedPassword = await hash(password, 8)
    const database = await sqliteConnection();
    const checkUserExists = await database.get('select * from users where email = (?)', [email])

    if (checkUserExists) {
      throw new AppError('Este e-mail já está em uso.')
    }
    else {
      console.log('cadastrado com sucesso!')
    }

    await database.run('insert into users (name, email, password) values (?, ?, ?)', [name, email, hashedPassword]);

    return res.status(201).json()
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const { id } = req.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

    if (!user) {
      throw new AppError('Usuário não encontrado!');
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso!');
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("v´cê precia informar a senha antiga para definir a nova senha")
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.")
      }

      user.password = await hash(password, 8)
    }

    await database.run(`
    UPDATE users SET
    name=?,
    email=?,
    password=?,
    updated_at=DATETIME('now')
    WHERE id=?`,
      [user.name, user.email,user.password, id]);

    return res.json();
  }

}

module.exports = UsersControllers;