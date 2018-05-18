const fs = require('fs');

const data = fs.readFileSync('categoriesData.dat').toString('utf8').split('\n');

for (const d of data) {
    const fileWithoutExtension = d.substr(0, d.indexOf('\t'));
    const fileName = `../categories/${fileWithoutExtension}.txt`;
    const fileContents = d.replace(`${fileWithoutExtension}\t`, '');
    const objectList = fileContents.split(';').filter(o => o != 0);
    let fileString = `parentID=${fileWithoutExtension}\nnumObjects=${objectList.length}`;
    objectCount = 0;
    for (const o of objectList) {
        fileString += `\n${o}`;
    }
    if (fileName.match('#') || fileName.match('@') ||
        fileString.match('#') || fileString.match('@')) {
            console.log(`Skipping file ${fileName} with ${fileString}`);
    } else {
        // console.log(`Creating file ${fileName} with contents ${fileString}`);
        fs.writeFileSync(fileName, fileString);
    }
}