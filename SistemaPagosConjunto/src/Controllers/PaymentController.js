const paymentService = require("../Services/PaymentService.js")

function payments(req, res) {
    const { body } = req;
    if(!body.torre || !body.apartamento){
        res.status(400).send({
            status: "FAILED",
            data: { error: "'torre' or 'apartamento' is empty or missing" },
        });
    }else{ 
        paymentService.payments(body, res)
    }
};

function bill(req, res) {
    const { body } = req;
    if(!body.torre || !body.apartamento || !body.index){
        res.status(400).send({
            status: "FAILED",
            data: { error: "'torre' or 'apartamento' or 'index' is empty or missing" },
        });
    }else{ 
        paymentService.bill(body, res)
    }
};

// todo modulo que referencie este archivo obtengra de retorno la funcion payments permitiendo asi ser invocada
// NOTA: al querer exportar 2 o mas cosntantes se deben hacer uso de las llaves { }, sin embargo si buscamos exportar si o si una
// funcion entonces esta cosntante debera de ir entre lalves { } a pesar de ser unicamente un elemento el que se desa exportar
module.exports = {
    payments, bill
}