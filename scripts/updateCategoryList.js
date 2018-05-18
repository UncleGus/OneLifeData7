const execSync = require('child_process').execSync;
const fs = require('fs');

console.log('Getting objects from list file');
const objectList = fs.readFileSync('objectList.txt').toString().split('\n');

const objectIdMap = {
    0: 'Nothing'
};

for (const object of objectList) {
    if (object) {
        const match = object.match(/(\d+)?\;(.+)?/);
        if (match[1] && match[2] && match[1] != 'undefined' && match[2] != 'undefined') {
            // console.log(`Updating objectIdMap with ${match[1]}: ${match[2]}`);
            objectIdMap[match[1]] = match[2];
        } else {
            console.log(`Problem with object ${object}`);
        }
    }
}

console.log('Getting file list');
const fileList = execSync('ls ../categories').toString().split('\n');

let listString = '';
for (const file of fileList) {
    let thisString = '';
    if (file && !isNaN(parseInt(file[0]))) {
        // console.log(`Reading file ${file}`);
    } else {
        continue;
    }
    const fileContents = fs.readFileSync(`../categories/${file}`).toString();
    const parentID = fileContents.match(/parentID=(\d+)?\n/);
    const objects = fileContents.match(/\n(\d+)?/g);
    thisString += `${objectIdMap[parentID[1]]}`;
    for (const object of objects) {
        const objectId = object.replace('\n', '');
        if (!objectId) {
            continue;
        }
        // console.log(`objectID is ${objectId} and match is ${objectIdMap[Number(objectId)]}`);
        thisString += `;${objectIdMap[Number(objectId)]}`;
    }
    thisString += '\n';
    if (!thisString.match('undefined')) {
        listString += thisString;
    } else {
        console.log(`Problem with ${file}`);
    }
}

console.log('Writing list file');
fs.writeFileSync('categoryList.txt', listString);