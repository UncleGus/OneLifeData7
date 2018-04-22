const fs = require('fs');

const data = fs.readFileSync('transitionsData.dat').toString('utf8').split('\n');

for (const d of data) {
    const fileWithoutExtension = d.substr(0, d.indexOf('\t'));
    const fileName = `../transitions/${fileWithoutExtension}.txt`;
    const fileContents = d.replace(`${fileWithoutExtension}\t`, '');
    if (fileName.match('#') || fileName.match('@') ||
        fileContents.match('#') || fileContents.match('@')) {
            console.log(`Skipping file ${fileName} with ${fileContents}`);
    } else {
        fs.writeFileSync(fileName, fileContents);
    }
}