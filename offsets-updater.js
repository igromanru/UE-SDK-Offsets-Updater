const fs = require('fs');
const path = require('path');

var endOfLine = '\r\n';//require('os').EOL;

if(process.argv.length > 3) {
    console.log(`Offsets.h path: ${process.argv[2]}`);
    console.log(`SDK source path: ${process.argv[3]}`);
    updateOffsets(process.argv[2], process.argv[3]);
} else {
    console.error("Not enough arguments passed!");
}

/**
 * @param offsetsFilePath Path to the Offsets.h
 * @param sdkPath Path to the .../SoT-SDK/SDK folder
 */
function updateOffsets(offsetsFilePath, sdkPath) {
    if(!fs.existsSync(offsetsFilePath)) {
        console.error(`Offsets file (${offsetsFilePath}) doesn't exists`);
        return;
    } else if(!fs.statSync(sdkPath).isDirectory) {
        console.error(`SDK source folder (${sdkPath}) doesn't exists`);
        return;
    }

    const offsetsFile = fs.readFileSync(offsetsFilePath, 'utf8');
    const endlineMatch = new RegExp('^.*?(\\s{1,2})$', 'gm').exec(offsetsFile);
    if(endlineMatch && endlineMatch.length > 1) {
        endOfLine = endlineMatch[1];
    }
    const offsetsFileArray = offsetsFile.split(endOfLine);
    if(offsetsFileArray && offsetsFileArray.length > 1) {
        const offsetStartRegEx = /\/\/ :(.*?:.*?:.*?)$/gm;
        //const offsetRegEx = /^.*?static\s+?constexpr\s+?int.*?=\s+?0x(.*?);/gm;
        for (var i = 0; i < offsetsFileArray.length; i++) { 
            console.log(offsetsFileArray[i]);
            const matches = offsetStartRegEx.exec(offsetsFileArray[i]);
            if(matches && matches.length > 0) {
                var offset = getOffsetFromSdk(matches[1], sdkPath);
                if(offset) {
                    const replacedLine = offsetsFileArray[i+1].replace(/0x.*?;/gm, `0x${offset};`);
                    if(replacedLine) {
                        offsetsFileArray[i+1] = replacedLine;
                    }
                }
            }
        }
        const writeStream = fs.createWriteStream(offsetsFilePath, {encoding: 'utf8'});
        if(writeStream) {
            const len = offsetsFileArray.length
            for (var i = 0; i < len; i++) {                  
                writeStream.write(offsetsFileArray[i], 'utf8');
                if(i < len-1) {
                    writeStream.write(endOfLine, 'utf8');
                }
            }
            writeStream.end();
            console.log(`update complete`); 
        } else {
            console.error(`Couldn't open the file (${offsetsFilePath}) to witre`); 
        }      
    } else {
        console.error(`Offsets file is empty`);
    }
}

/**
 * @param dataString Pattern: (class name):(offset name):(source file)
 * @param sdkPath Path to the .../SoT-SDK/SDK folder
 */
function getOffsetFromSdk(dataString, sdkPath) {
    var result = "error";
    const data = dataString.split(':');
    if(data && data.length === 3) {
        const className = data[0];
        const offsetName = data[1];
        const filePath = path.join(sdkPath, data[2]);

        if(fs.existsSync(filePath)) {            
            const classRegEx = new RegExp(`^(?:class|struct) ${className}(?:\\s|$)`, 'gm');
            const offsetRegEx = new RegExp(`.*?${offsetName};.*? \/\/ 0x(.*?)\\(0x`, 'gm');
            const fileAsArray = fs.readFileSync(filePath, 'utf8').split(endOfLine);
            
            var switchToOffset = false;
            for (var i = 0; i < fileAsArray.length; i++) {
                if(!switchToOffset) {
                    var matches = classRegEx.exec(fileAsArray[i]);
                    if(matches && matches.length > 0) {
                        switchToOffset = true;
                    }
                } else {
                    var matches = offsetRegEx.exec(fileAsArray[i]);
                    if(matches && matches.length > 0) {
                        result = matches[1];
                        break;
                    }
                }  
            }
        } else {
            console.error(`File (${filePath}) doesn't exists`);
        }
    }
    return result;
}