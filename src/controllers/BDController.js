const BDServices = require("../services/BDServices")
const verifyBDD = async (req, res) => {
    try {
        const result = await BDServices.pingBDD()
        res.status(200).json("Ping BDD")
    } catch (error) {
        res.status(400).json('Error PING')
    }

};


module.exports={
    verifyBDD
}