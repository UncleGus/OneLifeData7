const fs = require('fs');

const data = fs.readFileSync('objectsData.dat').toString('utf8').split('\n');
let nextObjectNumber = Number(fs.readFileSync('nextObjectNumber.txt').toString('utf8'));

for (const d of data) {
    const objectName = d.substr(0, d.indexOf('\t'));
    const copiedObjectId = d.replace(`${objectName}\t`, '');
    const copiedObjectFileContents = fs.readFileSync(`${copiedObjectId}.txt`).toString('utf8');

    const matchCopiedObjectId = copiedObjectFileContents.match(/id=(\d+)?/);
    const matchCopiedObjectName = copiedObjectFileContents.match(/\n(.+)?\ncontainable=/);

    const objectFileContents = copiedObjectFileContents.replace(matchCopiedObjectId[0], `id=${nextObjectNumber}`)
        .replace(matchCopiedObjectName[1], objectName);

    fs.writeFileSync(`${nextObjectNumber}.txt`, objectFileContents);
    nextObjectNumber += 1;
}
fs.writeFileSync('nextObjectNumber.txt', nextObjectNumber);