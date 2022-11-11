const userServices = require("../Services/UserService.js");

function login (req, res) {
    const { body } = req;
    if(!body.correo || !body.contraseña){
        res.status(400).send({
            status: "FAILED",
            data: { error: "'correo' or 'contraseña' is empty or missing" },
        });
    }else{ 
        userServices.validateUser(body, res)
    }
};

function register (req, res) {
    const { body } = req;
    if(!body.tipoIdentificacion || !body.noIdentificacion || !body.nombre || 
        !body.apellido || !body.correo || !body.contraseña || !body.telefono || !body.idApartamento ){
        res.status(400).send({
            status: "FAILED",
            data: { error: "'tipoIdentificacion' or 'noIdentificacion' or 'nombre' or 'apellido' or" 
                            +"'correo' or 'contraseña' or 'telefono' or 'idApartamento' is empty or missing" },
        });
    }else{ 
        userServices.createteUser(body, res);
    }
};

// todo modulo que referencie este archivo obtengra de retorno las funciones login y register permitiendo asi ser invocadas
// NOTA: al querer exportar 2 o mas cosntantes se deben hacer uso de las llaves { }, sin embargo si buscamos exportar si o si una
// funcion entonces esta cosntante debera de ir entre lalves { } a pesar de ser unicamente un elemento el que se desa exportar
module.exports = {login, register};