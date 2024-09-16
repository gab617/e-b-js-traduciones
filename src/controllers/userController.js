const userService = require("../services/userService");

const register = async (req, res) => {
  // Validación de contraseñas
  if (req.body.password !== req.body.passwordR) {
    // Si las contraseñas no coinciden, responde con un error y no continúa
    return res.status(400).json({ error: "Contraseñas no coinciden" });
  }

  // Crear las credenciales del nuevo usuario
  const nwUserCredentials = {
    user_handle: req.body.user_handle,
    password_hash: req.body.password,
  };

  try {
    console.log(req.body);

    // Llamada al servicio para registrar al usuario solo después de la validación exitosa
    const resultRegister = await userService.registerUser(req.body); // Asegúrate de pasar las credenciales correctas
    
    // Autenticar al usuario después del registro
    const resultLogin = await userService.authenticateUser(nwUserCredentials);
    
    // Devolver el resultado de autenticación
    res.status(200).json(resultLogin);

  } catch (error) {
    // Capturar y devolver cualquier error que ocurra durante el registro o autenticación
    res.status(400).json({ error: error.message });
  }
};

const pingDB =(req,res)=>{
  
}

const login = async (req, res) => {
  try {
    const result = await userService.authenticateUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadPointsUser = async (req, res) => {
    console.log(req.body)
  try {
    const result = await userService.updatePoints(req.body);
    res.status(200).json('Puntuacion actualizada');
  } catch (error) {
    res.status(400).json({ error: 'ERROR EN CONTROLLER' });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  uploadPointsUser,
};
