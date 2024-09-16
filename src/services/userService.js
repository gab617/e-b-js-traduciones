const db = require("../models/db");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const registerUser = async (userData) => {
  const saltRounds = 10;

  // Asegurarse de que userData contiene una contraseña
  if (!userData.password) {
    throw new Error("La contraseña es obligatoria");
  }

  try {
    // Crear una nueva instancia del usuario sin la contraseña en texto plano
    const user = new User(userData);

    // Hashear la contraseña antes de crear el usuario
    const password_hash = await bcrypt.hash(userData.password, saltRounds);
    user.password_hash = password_hash;

    delete user.password;

    // Insertar en la base de datos
    const query = "INSERT INTO users SET ?";
    return new Promise((resolve, reject) => {
      db.query(query, user, (err, result) => {
        if (err) {
          console.error(
            "Error al insertar el usuario en la base de datos:",
            err
          );
          return reject(err);
        }
        resolve(result);
      });
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    throw new Error("No se pudo registrar el usuario");
  }
};

const authenticateUser = async (userData) => {
  console.log(userData);
  const query = "SELECT * FROM users WHERE user_handle = ?";

  return new Promise((resolve, reject) => {
    // Primero, busca al usuario por su user_handle (no compares la contraseña aquí)
    db.query(query, [userData.user_handle], async (err, results) => {
      if (err) return reject(err);

      // Si no se encuentra al usuario, rechaza la promesa
      if (results.length === 0) {
        return reject(new Error("Usuario no encontrado"));
      }

      // Obtener el hash almacenado en la base de datos
      const storedHash = results[0].password_hash;

      try {
        // Comparar la contraseña ingresada con el hash almacenado usando bcrypt
        const passwordMatch = await bcrypt.compare(
          userData.password_hash,
          storedHash
        );

        if (!passwordMatch) {
          // Si la contraseña no coincide, rechaza
          return reject(new Error("Credenciales inválidas"));
        }

        // Si todo es correcto, resolver con los datos del usuario
        resolve({
          user: userData.user_handle,
          points: results[0].points,
          id_user: results[0].user_id,
          best_racha: results[0].best_racha,
        });
      } catch (compareError) {
        // Manejar posibles errores de comparación
        return reject(new Error("Error al verificar la contraseña"));
      }
    });
  });
};

const getAllUsers = async () => {
  const query = "SELECT user_id, user_handle, best_racha, points FROM users";
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const updatePoints = async (userData) => {
  // Verificar que `user_id` y `points` están presentes
  /* { userData: { user: 'gav', points: 3, id_user: 8 }, newPunt: 5 } */
  const { id_user, best_racha } = userData.userData;
  const points = userData.newPunt;
  const id = id_user;
  const newRacha = userData.rachaSession;

  const newPointsUser = userData.userData.points + points;
  console.log(
    newPointsUser,
    userData.userData.points,
    id,
    newPointsUser,
    newRacha,
    " desdes"
  );

  // Actualizar la puntuación en la base de datos
  const query = `
  UPDATE users
  SET
    points = ?,
    best_racha = CASE
      WHEN ? > best_racha THEN ?
      ELSE best_racha
    END
  WHERE user_id = ?;
`;
  return new Promise((resolve, reject) => {
    db.query(query, [newPointsUser, newRacha, newRacha, id], (err, results) => {
      if (err) return reject(err);
      if (results.affectedRows === 0) {
        return reject(new Error("Usuario no encontrado"));
      }
      resolve(results);
    });
  });
};

const pingDB = async () => {
  
};

module.exports = {
  registerUser,
  authenticateUser,
  getAllUsers,
  updatePoints,
};
