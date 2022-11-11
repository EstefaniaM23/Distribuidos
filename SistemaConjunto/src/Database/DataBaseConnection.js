// en caso de presentar inconvenientes a la hora de conectar nodejs con mysql se puede deber a la falta de configuracion del usuario
// con acceso a dicha base de datos, para solucionar este incombeniente solo es necessario ejecutar la linea a continuacion para 
// solucionar el error
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'

//ngrok tcp 3306

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgres://kuqmjesaochhrx:1550d62d9a2834932bee4710adddd7ab92dac65bcd387a3c640c02eb67b600c7@ec2-107-23-76-12.compute-1.amazonaws.com:5432/ddmi327c6ro32p",
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;