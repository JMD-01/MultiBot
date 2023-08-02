const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const { tar, zip } = require('zip-a-folder');
let OS = process.argv[2];
let ARCH = process.argv[3];


switch (OS) {
      case 'windows':
            if(ARCH === 'x64') {
              uploadFile('win', 'x64', 'win-unpacked');
            }
            if(ARCH === 'ia32') {
              uploadFile('win', 'ia32', 'win-ia32-unpacked');
            }
            break;
      case 'linux':
            if(ARCH === 'x64') {
              uploadFile('linux', 'x64', 'linux-unpacked');
            }
            break;
      case 'mac':
            if(ARCH === 'x64') {
              uploadFile('mac', 'x64', 'mac-unpacked');
            }
            if (ARCH === 'arm64') {
              uploadFile('mac', 'arm64', 'mac-arm64-unpacked');
            }
            break;
}

async function uploadFile(os, arch, folderName) {
  await zip(__dirname+`/release/${process.env.version}/${os}/${arch}/${folderName}/`, __dirname+`/release/${process.env.version}/${os}/${arch}/GUI.zip`);
  let formData = new FormData();
  formData.append('file', fs.createReadStream(__dirname+`/release/${process.env.version}/${os}/${arch}/GUI.zip`));
  const headers = formData.getHeaders()

  let response = await axios({
    method: 'post',
    url: `http://localhost:3000/upload_gui/${process.env.version}/${os}/${arch}/`,
    headers: headers,
    data: formData,
    maxBodyLength: 200*1024*1024,
    validateStatus: () => true
  });
  if(response.status === 204) {
    console.log(`Uploaded ${os} ${arch} ${process.env.version}`);
  } else {
    console.log(`Error uploading ${os} ${arch}`);
    console.log(response.data);
    throw Error(response.data.toString());
  }
}