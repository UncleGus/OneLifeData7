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
const fileList = execSync('ls ../transitions').toString().split('\n');

let listString = '';
for (const file of fileList) {
    let thisString = '';
    if (file && file.match(/_/)) {
        const match = file.match(/([^_]+)?_([^_]+)?(_.*)?\.txt/);
        const fileContents = fs.readFileSync(`../transitions/${file}`).toString().split(' ');
        // console.log(`Adding transition ${match[1]} on ${match[2]}: ${objectIdMap[match[1]]} on ${objectIdMap[match[2]]}`);
        if (match[1] == -2) { // actor
            thisString += 'Player of any age;'; // actor
        } else if (match[1] == -1) {
            thisString += 'Time decay;';
        } else {
            thisString += `${objectIdMap[match[1]]};`;
        }
        if (match[2] == '0') { // special case for kill transition
            thisString += 'Player;';
        } else if (match[2] == '-1') {
            if (Number(fileContents[1]) == 0) {
                thisString += 'Generic transition;';
            } else {
                thisString += 'Empty ground;';
            }
        } else {
            thisString += `${objectIdMap[match[2]]};`; // target
        }
        thisString += `${objectIdMap[fileContents[0]]};`; // new actor
        thisString += `${objectIdMap[fileContents[1]]};`; // new target
        if (match[3]) { // last use
            if (match[3] == '_LA') {
                thisString += 'Actor;';
            } else if (match[3] == '_LT' || match[3] == '_L') {
                thisString += 'Target;';
            }
        } else {
            thisString += ';';
        }
        for (let i = 2; i < fileContents.length && i < 9; i++) {
            thisString += `${fileContents[i]};`;
            // autoDecaySeconds, actorMinUseFraction, targetMinUseFraction, reverseUseActorFlag,
            // reverseUseTargetFlag, move, desiredMoveDist,
        }
        if (fileContents[9]) { // noUseActorFlag
            thisString += `${fileContents[9]};`;
        }
        if (fileContents[10]) { // noUseTargetFlag
            thisString += `${fileContents[10]};`;
        }
        thisString += '\n';
        if (!thisString.match('undefined')) {
            listString += thisString;
        } else {
            console.log(`Problem with ${file}: ${thisString}`);
        }
    }
}

console.log('Writing list file');
fs.writeFileSync('transitionList.txt', listString);