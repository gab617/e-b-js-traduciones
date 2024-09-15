const userService = require("../services/userService");

const register = async (req, res) => {
  const nwUserCredentials = {
    user_handle: req.body.name_user,
    password_hash: req.body.password,
  }
  try {
    console.log(req.body)
    const resultRegister = await userService.registerUser(req.body);
    const resultLogin= await userService.authenticateUser(nwUserCredentials);
    res.status(200).json(resultLogin);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
