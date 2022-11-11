const db = require("./DataBaseConnection");

function getUserByEmail (body, callback) {
    // console.log(`SELECT * FROM Propietarios WHERE CorreoElectronico='${body.correo}' AND Contraseña='${body.contraseña}';`);
    db.query(`SELECT * FROM Propietarios WHERE CorreoElectronico='${body.correo}' AND Contraseña='${body.contraseña}';`, (error, results, fields)=>{
        console.log(results)
        if(results.rows.length){//1 verdadero   0 falso
            callback(results.rows.length, results.rows[0].torre, results.rows[0].apartamento);
        }else{
            callback(results.rows.length, -1, -1);
        }
    });
}

function insertUser(body, res, torre, apartamento, callback){
    db.query(`INSERT INTO Propietarios (TipoIdentificacion, NoIdentificacion, Nombre, Apellido, CorreoElectronico, Contraseña, Telefono, Torre, Apartamento) VALUES ('${body.tipoIdentificacion}', ${body.noIdentificacion}, '${body.nombre}', '${body.apellido}', '${body.correo}', '${body.contraseña}', ${body.telefono}, ${torre}, ${apartamento});`, (error, results, fields)=>{
        if(error){
            // throw error;
            callback(res, false)
        }else{
            callback(res, true)
        }
        
    });
}


module.exports ={
    getUserByEmail, insertUser 
}