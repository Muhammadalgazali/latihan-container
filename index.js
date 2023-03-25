'use strict';


const fs = require('fs'); //membaca json
const { nanoid } = require('nanoid');
const Hapi = require('@hapi/hapi');

//function get number from database
function getPhoneNumber(){
    let jsonData = fs.readFileSync('data.json')
    let data = JSON.parse(jsonData)
    return data
}

//function to delete phone number from Database
function deletePhoneNumber(id){
    let jsonData = fs.readFileSync('data.json')
    let data = JSON.parse(jsonData)
    
    //search through data by looping
    const index = data.findIndex((temp) => temp.id === id)

    if (index === -1){
        return false
    }

    data.splice(index, 1)
    jsonData = JSON.stringify(data)
    fs.writeFileSync('data.json', jsonData)
    return true
}

//function to save phone number from Database
function savePhoneNumberToJson(name, phone_number){
    let id = nanoid(8)
    let jsonData = fs.readFileSync('data.json')
    let data = JSON.parse(jsonData)
    
    data.push({
        "id": id,
        "name": name,
        "phone_number": phone_number
    })
    //search through data by looping
    // const index = data.findIndex((temp) => temp.id === id)
    jsonData = JSON.stringify(data)
    fs.writeFileSync('data.json', jsonData)
}

//GET console.log(getPhoneNumber());
//DELETE let berhasil = deletePhoneNumber("Qbax5O");
//POST savePhoneNumberToJson("windi", "0832472");
//console.log(getPhoneNumber());
//savePhoneNumberToJson("windi", "0832472");
//console.log(getPhoneNumber());

//Hapi function

/*
savePhoneNumberToJson("dfgfdg", "456355");
savePhoneNumberToJson("sfgsdfg", "34655465");
savePhoneNumberToJson("fdgfsdg", "46535");
savePhoneNumberToJson("eryer", "546456");
console.log(getPhoneNumber());
*/


const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        // saat deploy jadikan 0.0.0.0
    });

    //  Read all contact || GET
    server.route({
        method: 'GET',
        path: '/contact',
        handler: () => {
            return getPhoneNumber()
        }
    })

    // Delete contact || DELETE
    server.route({
        method: 'DELETE',
        path: '/contact/{contactID}',
        handler: (request, h) => {
            // Get contact id from request
            const contactId = request.params.contactID
    
            // Delete from database by contact id
            const success = deletePhoneNumber(contactId)
            
            //Check if successfully deleted
            if (!success) {
                const response = h.response({
                    status: 'fail',
                    message: `Gagal delete kontak. Mohon isi id dengan benar, yang anda masukkan adalah `+contactId
                })
                response.code(400)
                return response
            }
            return 'success';
        }
    })

    // Create contact || POST
    server.route({
        method: 'POST',
        path: '/contact',
        handler: (request, h) => {

            // Get data
            const {name, phone_number} = request.payload
    
            // Check requested data
            if (name === undefined || phone_number === undefined || name === '' || phone_number === '') {
                const response = h.response({
                    status: 'fail',
                    message: `Gagal menambahkan kontak. Mohon isi nama kontak dan nomor telepon, yang anda masukkan adalah `+name + ' ' + phone_number
                })
                response.code(400)
                return response
            }

            //save to database
            savePhoneNumberToJson(name, phone_number)
            return `Success`;

        }
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

//console.log(getPhoneNumber());


