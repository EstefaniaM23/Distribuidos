const userDao = require("../Database/UserDao.js");
const google = require("./GoogleServices.js")

function validateUser (body, res) {
    userDao.getUserByEmail(body, (results, torre, apartamento) =>{
        if(results){//1 verdadero   0 falso
            res.status(201).send({
                status: "authorized",
                data: {
                    torre : torre,
                    apartamento: apartamento
                }
            });
        }else{
            res.status(401).send({
                status: "UNAUTHORIZED",
                data: { error: "wrong credentials" },
            });
        }
    });
};


function createteUser (body, res) {
    google.getApartamentosData(body, res, (body, res, status, torre, apartamento)=>{
        if(status){//si existe dicho apartamento
            userDao.insertUser(body, res, torre, apartamento, (res, status)=>{
                if(status){
                    res.status(201).send({
                        status: "new user created",
                    });
                }else{
                    res.status(400).send({
                        status: "Bad request",
                        data: { error: `this email already exist` },
                    });
                }
            });
        }else{
            res.status(400).send({
                status: "Bad request",
                data: { error: "apartamentoId doesn´t exist" },
            });
        }
    })
};

module.exports = {
    validateUser, createteUser
}
