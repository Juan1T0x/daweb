const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { nombre, apellidos, email, password, birthdate, role } = req.body;

  console.log("Datos recibidos:", {
    nombre,
    apellidos,
    email,
    password,
    birthdate,
    role,
  });

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "La contraseña es requerida." });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      nombre,
      apellidos,
      email,
      password: hashedPassword,
      birthdate,
      role,
    });

    res
      .status(201)
      .json({ success: true, message: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al registrar el usuario." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Contraseña incorrecta." });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al iniciar sesión." });
  }
};

exports.logout = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Sesión cerrada correctamente." });
};
