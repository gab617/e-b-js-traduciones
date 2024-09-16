const db = require("../models/db");

const pingBDD = async () => {
  try {
    const query = "SELECT 1";

    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          console.error("Error al hacer ping a la base de datos", err);
          return reject(err);
        }
        resolve(result);
      });
    });
  } catch (error) {
    console.error("Error ping BDD");
    throw new Error("No hay respuesta a ping");
  }
};

module.exports = {
  pingBDD,
};
