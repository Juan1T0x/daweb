const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Obtener información de un usuario por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado." });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener el usuario." });
  }
};

// Modificar información de un usuario por ID
exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, email, password, birthdate, role } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado." });
    }

    user.nombre = nombre || user.nombre;
    user.apellidos = apellidos || user.apellidos;
    user.email = email || user.email;
    user.birthdate = birthdate || user.birthdate;
    user.role = role || user.role;

    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar el usuario." });
  }
};
