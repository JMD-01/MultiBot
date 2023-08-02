const net = require('net');

if(process.env.NODE_ENV === 'development'){

  const client = new net.Socket();

  let startedElectron = false;
  const tryConnection = () => client.connect({port: 3000}, () => {
      client.end();
      if(!startedElectron) {
        console.log('starting electron');
        startedElectron = true;
        const exec = require('child_process').exec;
        let GUI = exec('npm run start:main',{env: {...process.env}}, (error, stdout, stderr) => {
          if (error) {
            console.error(stderr);
          }
          console.log(stdout);
        });
        GUI.on('exit', () => {
          process.exit();
        });
      }
    }
  );

  tryConnection();

  client.on('error', (error) => {
    setTimeout(tryConnection, 1000);
  });
}