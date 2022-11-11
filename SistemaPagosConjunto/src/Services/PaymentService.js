const google = require("./GoogleServices.js")
const fs = require('fs')

const pagos = ["M", "M", "M", "E", "M", "M", "M", "M", "E", "M", "M", "M", "M", "E", "M"]
const valorBase = 50000
const areaBase = 80
const areaTotal = 12000

function restructureApartment(comprobante){
    var data = ""
    data += `\t{\n`
    data += `\t\t"torre": ${comprobante.torre},\n`
    data += `\t\t"apartamento": ${comprobante.apartamento},\n`
    data += `\t\t"pagos": [\n`
    data += `${restructurePay(comprobante.pagos)}`
    data += `\t\t]\n`
    data += "\t}"
    data += (comprobante.torre==10 && comprobante.apartamento==29)?"\n":",\n"
    return data
}

function restructurePay(pagos){
    var data = ""
    pagos.map((pago) => {
        data += `\t\t\t{\n`
        data += `\t\t\t\t"id": ${pago.id},\n`
        data += `\t\t\t\t"fecha": "${pago.fecha}",\n`
        data += `\t\t\t\t"descripcion": "${pago.descripcion}",\n`
        data += `\t\t\t\t"valor": "${parseInt(pago.valor )}"\n`
        data += "\t\t\t}"    
        data += (pago==pagos[pagos.length-1])?"\n":",\n"
    });
    return data
}

function randomDate(start, end) {
    var date = new Date(+start + Math.random() * (end - start));
    return `${date.getDay()+1}/${date.getMonth()+1}/${date.getFullYear()}`
}

async function simulatePayments(){
    await new Promise(r => setTimeout(r, 10000));
    //minutos
    const max = 1 
    const min = 0.5
    while(true){
        var apartamento = Math.floor(Math.random() * (29 +1 - 1) ) + 1
        var torre = Math.floor(Math.random() * (10 +1 - 1) ) + 1
        const comprobantes = await google.getPaymentsData()
        var data = "[\n"
        JSON.parse(comprobantes).map((comprobante) => {//parse string to json e iteracion
            if(comprobante.torre == torre && comprobante.apartamento == apartamento && comprobante.pagos.length<15){
                var index = (comprobante.pagos.length==0)?0:comprobante.pagos.length
                const date = new Date()
                const id = date.getFullYear()+""+(date.getMonth()+1)+""+(((date.getDay()+2).toString().length==1)?"0":"")+(date.getDay()+2)+""+date.getHours()+""+((date.getMinutes().toString().length==1)?"0":"")+date.getMinutes()+""+((date.getSeconds().toString().length==1)?"0":"")+date.getSeconds()
                const randDate = randomDate((comprobante.pagos.length==0)?new Date(2022, 0, 1):new Date(comprobante.pagos[comprobante.pagos.length-1].fecha), new Date())
                if(pagos[index]=="M"){//mensualidad
                    
                    comprobante.pagos[index]={
                        id:  id,
                        fecha: randDate,
                        descripcion: "Pago Mensualidad",
                        valor: valorBase+(valorBase*((areaBase+(((torre-1)/2)*20))*100/areaTotal))
                    }
                }else{//pago extraordinario
                    comprobante.pagos[index]={
                        id:  id,
                        fecha: randDate,
                        descripcion: "Pago Extraordianrio",
                        valor: valorBase*.8 //80%
                    }
                }
                console.log(`Pago exitoso para el apartamento ${apartamento}, torre ${torre}`)
            }
            data += restructureApartment(comprobante)
            
        });
        data += "]"
        
        fs.writeFile("C:\Users\Usuario\Desktop\Sistemas Distribuidos\SistemaPagosConjunto\ComprobantesDePagos.json", data, (err)=>{})
        google.setPaymentsData(data)
        //sleep de min minutos a max minutos... 30 segundos a 3 minutos
        var sleep = Math.floor(Math.random() * ((max*60000) +1 - (min*60000)) ) + (min*60000)
        console.log("====>>>Proximo pago en: "+parseInt(sleep/60000)+" min, "+parseInt((sleep%60000)/1000)+" seg<<<===")
        await new Promise(r => setTimeout(r, sleep));
    }
}

async function payments(body, res) {
    const comprobantes = await google.getPaymentsData()
    var data = null
    JSON.parse(comprobantes).map((comprobante) => {
        if(comprobante.torre==body.torre && comprobante.apartamento ==body.apartamento){
            data = comprobante
        }
    })
    if(data){
        res.status(200).send(data)
    }else{
        res.status(400).send({
            status: "FAILED",
            data: { error: "we couldn´t fount the informatio that you search" },
        });
    }

};

async function bill(body, res) {
    const comprobantes = await google.getPaymentsData()
    var data = null
    JSON.parse(comprobantes).map((comprobante) => {
        if(comprobante.torre==body.torre && comprobante.apartamento ==body.apartamento){
            data = comprobante
        }
    })
    if(data && data.pagos.length>=body.index){
        console.log(data)
            res.status(200).send(data.pagos[body.index])
    }else{
        res.status(400).send({
            status: "FAILED",
            data: { error: "we couldn´t fount the informatio that you search" },
        });
    }
};

simulatePayments()
module.exports = {
    payments, bill
}