const fs = require('fs');

const data = fs.readFileSync('objectsData.dat').toString('utf8').split('\n');
let nextObjectNumber = Number(fs.readFileSync('../objects/nextObjectNumber.txt').toString('utf8'));

for (const d of data) {
    const objectName = d.substr(0, d.indexOf('\t'));
    const copiedObjectId = d.replace(`${objectName}\t`, '');
    const copiedObjectFileContents = fs.readFileSync(`${copiedObjectId}.txt`).toString('utf8');

    const matchCopiedObjectId = copiedObjectFileContents.match(/id=(\d+)?/);
    const matchCopiedObjectName = copiedObjectFileContents.match(/\n(.+)?\ncontainable=/);

    let objectFileContents = copiedObjectFileContents.replace(matchCopiedObjectId[0], `id=${nextObjectNumber}`)
        .replace(matchCopiedObjectName[1], objectName);

    
    // this recolours the copper anvil sprite to bronze
    objectFileContents = objectFileContents.replace('spriteID=565\npos=0.000000,-11.000000\nrot=0.000000\nhFlip=0\ncolor=1.000000,0.723468,0.521127',
        'spriteID=565\npos=0.000000,-11.000000\nrot=0.000000\nhFlip=0\ncolor=0.684396,0.718310,0.374330');

    if (matchCopiedObjectName[1] == objectName) {
        console.log(`Skipping file; ${matchCopiedObjectName[1]} needs name updated`);
    } else {
        fs.writeFileSync(`../objects/${nextObjectNumber}.txt`, objectFileContents);
        nextObjectNumber += 1;
    }
}
fs.writeFileSync('../objects/nextObjectNumber.txt', nextObjectNumber);