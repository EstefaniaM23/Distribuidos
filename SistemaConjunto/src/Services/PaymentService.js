const request = require('request');

var host  = 'https://c511-191-156-70-212.ngrok.io';

function getPayments(reqbody, res){
    request.post({
        url:     host+'/payments',
        body:    reqbody,
        json: true
    }, function(error, httpResponse, body){
        res.status(httpResponse.statusCode).send(body)    
    });
}

function bill(reqbody, res){
    
    request.post({
        url:     host+'/bill',
        body:    reqbody,
        json: true
    }, function(error, httpResponse, body){
        res.status(httpResponse.statusCode).send(body)    
    });
}

function pay(reqbody, res){
    
    request.post({
        url:     host+'/pay',
        body:    reqbody,
        json: true
    }, function(error, httpResponse, body){
        res.status(httpResponse.statusCode).send(body)    
    });
}

function certificate(reqbody, res){
    request.post({
        url:     host+'/payments',
        body:    reqbody,
        json: true
    }, function(error, httpResponse, body){    

        if(httpResponse.statusCode!=200){
            res.status(httpResponse.statusCode).send(body)
        }else{
            var responsabilidades = new Date().getMonth()
            
            if(responsabilidades>=11){//pago 3 extraordianrio
                responsabilidades++
            }
            if(responsabilidades>=7){//pago 2 extraordianrio
                responsabilidades++
            }
            if(responsabilidades>=3){//pago 1 extraordianrio
                responsabilidades++
            }
            if(body.pagos.length-1==responsabilidades){
                res.status(200).send("El inmueble se encuentra al dia con los pagos correspondientes")
            }else if(body.pagos.length-1>responsabilidades){
                var pagosExtras = ((body.pagos.length-1)-responsabilidades);
                res.status(200).send(`El inmueble se encuentra al dia con los pagos correspondientes, ademas de contar con ${pagosExtras} pagos de meses entrantes ya cancelados`)
            }else if(body.pagos.length-1<responsabilidades){
                var pagosFaltantes = (responsabilidades-(body.pagos.length-1));
                res.status(200).send(`El inmueble se encuentra atrasado con ${pagosFaltantes} pagos`)
            }
        }
    });
}

module.exports = {
    getPayments, bill, certificate, pay
}