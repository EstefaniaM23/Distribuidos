// importacion de modulos
const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController.js");
const paymentController = require("../Controllers/PaymentController.js");

// Establecemos las url disponibles para el consumo de nuestra API
router
    .get("/", (req, res) => { 
        res.send('API sistema residencial palmas doradas'); 
    })
    .post("/login", userController.login)
    .post("/register", userController.register)
    .post("/payments", paymentController.payments)
    .post("/bill", paymentController.bill)
    .post("/certificate", paymentController.certificate)
    .post("/pay", paymentController.pay);

// todo modulo que referencie este archivo obtengra de retorno la cosntante router con las url ya agregadas
module.exports= router;