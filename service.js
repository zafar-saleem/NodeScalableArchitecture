#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const lineByLineReader = require('line-by-line');

program
  .version('0.0.1')
  .description('Tool to make new service and its respective controller and an entry in routes');

program
  .command('new <servicename> <apiv>')
  .alias('a')
  .description('Create a service')
  .action((serviceName, apiVersion) => {
    createServiceFile(serviceName);
    createControllerFile(serviceName);
    addEntryToRoutes(apiVersion, serviceName);
  });

const createServiceFolder = (foldername) => {
  return new Promise((resolve, reject) => {
    const folderPath = process.cwd() + '/server/services/' + foldername;

    if (!fs.existsSync(folderPath)){
      fs.mkdirSync(folderPath);
      resolve(folderPath);
    } else {
      reject('Service with ' + foldername + ' already exist');
    }
  });
}

const createServiceFile = (filename) => {
  createServiceFolder(filename).then((folderPath, error) => {
    const filePath = folderPath + '/index.js';
    shell.touch(filePath);

    return filePath;
  }).catch(error => {
    console.log(error);
  });
};

const createControllerFolder = (controllerFolder) => {
  return new Promise((resolve, reject) => {
    const folderPath = process.cwd() + '/server/controllers/apis/' + controllerFolder;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      resolve(folderPath);
    } else {
      reject('Service with ' + controllerFolder + ' already exist');
    }
  });
}

const createControllerFile = (controllerFile) => {
  createControllerFolder(controllerFile).then((folderPath, error) => {
    const filePath = folderPath + '/index.js';
    shell.touch(filePath);

    let content = '';
    content += "'use strict'\n\n";
    content += "const express = require('express');\n";
    content += "const " + controllerFile + "Service = require('../../../services/" + controllerFile + "');\n\n";
    content += "let router = express.Router();\n\n";
    content += "router.post('/', " + controllerFile + "Service.AddYourMethod);\n\n";
    content += "module.exports = router;\n";

    fs.appendFile(filePath, content, (err) => {
      if (err) {
        console.error(err)
        return
      }
    });

    return filePath;
  }).catch(error => {
    console.log(error);
  });
};

const addEntryToRoutes = (apiVersion, controllerName) => {
  let apiRoutePath = './server/routes/apis/' + apiVersion + '/index.js';

  readApiRouteFile(controllerName, apiVersion).then(response => {
    fs.writeFile(apiRoutePath, response.toString().replace(/,/g, '\n'), function () {
      console.log('Service is created');
    });
  });
};

const readApiRouteFile = (controllerName, apiVersion) => {
  let lr = new lineByLineReader('./server/routes/apis/' + apiVersion + '/index.js');
  let lines = [];
  let row = 0;

  return new Promise((resolve, reject) => {
    lr.on('line', function (line) {
      lines.push(line);

      if (line.length == 0) {
        if (row === 1) {
          lines.push("const " + controllerName + "Controller = require('../../../controllers/apis/" + controllerName + "');");
        }
      }

      if (line.includes('let')) {
        let nextRow = row + 1;
        nextRow++;

        lines.splice(nextRow, 0, "\nrouter.use('/" + controllerName + "', " + controllerName + "Controller);");
      }

      row++;
    });

    lr.on('end', function () {
      resolve(lines);
      lines = [];
    });
  });
};

if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
  program.outputHelp();
  process.exit();
}

program.parse(process.argv);
