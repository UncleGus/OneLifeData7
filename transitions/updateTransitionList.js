const execSync = require('child_process').execSync;
const fs = require('fs');

console.log('Getting objects from list file');
const objectList = fs.readFileSync('../objects/objectList.txt').toString().split('\n');

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
const fileList = execSync('ls').toString().split('\n');

let listString = '';
for (const file of fileList) {
    if (file && file.match(/_/)) {
        const match = file.match(/([^_]+)?_([^_]+)?(_.*)?\.txt/);
        const fileContents = fs.readFileSync(file).toString().split(' ');
        // console.log(`Adding transition ${match[1]} on ${match[2]}: ${objectIdMap[match[1]]} on ${objectIdMap[match[2]]}`);
        if (match[1] == -2) { // actor
            listString += 'Player of any age;'; // actor
        } else if (match[1] == -1) {
            listString += 'Time decay;';
        } else {
            listString += `${objectIdMap[match[1]]};`;
        }
        if (match[2] == '0') { // special case for kill transition
            listString += 'Player;';
        } else if (match[2] == '-1') {
            if (Number(fileContents[1]) == 0) {
                listString += 'Generic transition;';
            } else {
                listString += 'Empty ground;';
            }
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
        for (let i = 2; i < fileContents.length && i < 9; i++) {
            listString += `${fileContents[i]};`;
            // autoDecaySeconds, actorMinUseFraction, targetMinUseFraction, reverseUseActorFlag,
            // reverseUseTargetFlag, move, desiredMoveDist,
        }
        if (fileContents[9]) { // actorBreakChance
            if (Number(fileContents[9]) == 0) {
                listString += `;`;
            } else {
                listString += `${fileContents[9]};`;
            }
        }
        if (fileContents[10]) { // brokenActor
            if (Number(fileContents[10]) == 0) {
                listString += `;`;
            } else {
                listString += `${objectIdMap[fileContents[10]]};`;
            }
        }
        if (fileContents[11]) { // targetBreakChance
            if (Number(fileContents[11]) == 0) {
                listString += `;`;
            } else {
                listString += `${fileContents[11]};`;
            }
        }
        if (fileContents[12]) { // brokenTarget
            if (Number(fileContents[12]) == 0) {
                listString += `;`;
            } else {
                listString += `${objectIdMap[fileContents[12]]};`;
            }
        }
        listString += '\n';
    }
}

fs.writeFileSync('transitionList.txt', listString);