const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const crypto = require("./CryptoServices.js");

// If modifying these scopes, delete token.json.
const SCOPES = [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.appdata',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/drive.metadata',
                'https://www.googleapis.com/auth/drive.metadata.readonly',
                'https://www.googleapis.com/auth/drive.photos.readonly',
                'https://www.googleapis.com/auth/drive.readonly',
              ];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

var drive;

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    authClient = client;
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  authClient = client;
  return client;
}

//definimso el acceso de drive
//authClient es un objeto OAuth2Client que contiene toda la informacion de nuestro usuario permitiendo asi establecer 
// la coneccion con google drive
async function defineDrive(authClient) {
  drive = google.drive({version: 'v3', auth: authClient});
  // showList();
}

//Esta funcion nso permitira obtener el nombre y ID del archivo  alojado en google drive los cuales se meustran en orden de la 
// modificacion mas reciente a la mas antigua  con el fin de aposterior identificar y poder hacer la busqueda directamente a dicho 
// archivo mediante su ID 👇👇
async function showList(){
  try{
    const res = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    });
    const files = res.data.files;
    if (files.length === 0) {
      console.log('No files found.');
      return;
    }
  
    console.log('Files:');
    files.map((file) => {
      console.log(`${file.name} (${file.id})`);
    });
  }catch(error){//timeout
    console.log("⚠️ ⚠️ Fallo en showList() ⚠️ ⚠️")
  }

}

const fileId = "1uyYrhsWCh8fxt4YihXCCbDztLNG1Ce8U";//ID del archivo ComprobantesDePagos

async function getPaymentsData(){
  try{
    const res = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    });
    return crypto.decrypt(res.data);//desencriptado respuesta
  }catch(error){//timeout
    console.log("⚠️ ⚠️ Fallo en getPaymentsData() ⚠️ ⚠️")
  }

}

async function setPaymentsData(data){
  try{
    await drive.files.update({
      fileId,
      media: {
        mimeType: 'application/octet-stream',
        body: crypto.encrypt(data)
      },
    });
  }catch(error){//timeout
    console.log("⚠️ ⚠️ Fallo en setPaymentsData() ⚠️ ⚠️")
  }

}

authorize().then(defineDrive)

module.exports = {
  getPaymentsData, setPaymentsData
};
