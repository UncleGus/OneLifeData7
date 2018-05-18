const execSync = require('child_process').execSync;
const fs = require('fs');

console.log('Getting file list');
const fileList = execSync('ls ../objects').toString().split('\n');

const objectIdMap = {};

for (const file of fileList) {
    if (file && !isNaN(parseInt(file[0]))) {
        // console.log(`Reading file ${file}`);
    } else {
        // console.log(`Skipping file ${file}`);
        continue;
    }
    const fileContents = fs.readFileSync(`../objects/${file}`).toString();
    const id = fileContents.match(/id=(\d+)?\n/);
    const name = fileContents.match(/\n(.+)?\n/);
    if (id != null && name != null) {
        if (!name[1]) {
            console.log(`Problem in file ${file}`);
        } else {
            // console.log(`Storing object ${id[1]}: ${name[1]}`);
        objectIdMap[id[1]] = name[1];
        }
    } else {
        console.log (`Some kind of problem with ${file} id=${id} and name=${name}`);
    }
}

let listString = '';

for (const p in objectIdMap) {
    listString += `${p};${objectIdMap[p]}\n`;
}

console.log('Writing list file');
fs.writeFileSync('objectList.txt', listString);