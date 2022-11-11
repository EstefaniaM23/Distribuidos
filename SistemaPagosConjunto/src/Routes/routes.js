// importacion de modulos
const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/PaymentController.js");

// Establecemos las url disponibles para el consumo de nuestra API
router
    .get("/", (req, res) => { 
        res.send('API Banco diente de oro, pata de palo. Protector del oro del caribe'); 
    })
    .post("/payments", paymentController.payments)
    .post("/bill", paymentController.bill)

// todo modulo que referencie este archivo obtengra de retorno la cosntante router con las url ya agregadas
module.exports= router;