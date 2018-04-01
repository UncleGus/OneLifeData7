const execSync = require('child_process').execSync;
const fs = require('fs');

console.log('Getting objects from list file');
const objectList = fs.readFileSync('../objects/objectList.txt').toString().split('\n');

const objectIdMap = {
    '0': 'Nothing',
    '-1': 'Nothing',
    '-2': 'Nothing'
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
const fileList = execSync('ls').toString().split('\n');

let listString = '';
for (const file of fileList) {
    if (file && file.match(/_/)) {
        const match = file.match(/([^_]+)?_([^_]+)?(_.*)?\.txt/);
        const fileContents = fs.readFileSync(file).toString().split(' ');
        // console.log(`Adding transition ${match[1]} on ${match[2]}: ${objectIdMap[match[1]]} on ${objectIdMap[match[2]]}`);
        listString += `${objectIdMap[match[1]]};`; // actor
        if (match[2] == '0' && match[3] && match[3] == '_LT') { // special case for kill transition
            listString += 'Player;';
        } else {
            listString += `${objectIdMap[match[2]]};`; // target
        }
        listString += `${objectIdMap[fileContents[0]]};`; // new actor
        listString += `${objectIdMap[fileContents[1]]};`; // new target
        if (match[3]) { // last use
            if (match[3] == '_LA') {
                listString += 'Actor;';
            } else if (match[3] == '_LT' || match[3] == '_L') {
                listString += 'Target;';
            }
        } else {
            listString += ';';
        }
        for (let i = 2; i < fileContents.length && i < 10; i++) {
            listString += `${fileContents[i]};`;
            // autoDecaySeconds, actorMinUseFraction, targetMinUseFraction, reverseUseActorFlag,
            // reverseUseTargetFlag, move, desiredMoveDist,
            // actorBreakChance
        }
        if (fileContents[10]) {
            listString += `${objectIdMap[fileContents[10]]};`; // brokenActor
        }
        if (fileContents[11]) {
            listString += `${fileContents[11]};`; // targetBreakChance
        }
        if (fileContents[12]) {
            listString += `${objectIdMap[fileContents[12]]};`; // brokenTarget
        }
        listString += '\n';
    }
}

fs.writeFileSync('transitionList.txt', listString);