// importacion de modulos
const express = require("express"); 
const routes = require("./routes/routes.js");

// inicializamso el modulo express
const app = express(); 

// establecemos el puerto sobre el que trabajara el app
const PORT =3002; 

// Indicamos al aplicativo que use esta libreria con el fin de que automaticamente interbenga en las peticiones 
// y nos permita acceder al body
app.use(express.json())

// Indicamos al aplicativo que use las url disponibles en routes partiendo como direccion base
app.use("/", routes);

// despliegue y mensaje de confirmacion de despleigue
app.listen(PORT, () => { 
    console.log(`Sistema conjunto residencial funcionando en el puerto ${PORT}`); 
});

