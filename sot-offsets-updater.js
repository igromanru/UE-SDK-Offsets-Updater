
if(process.argv.length > 3) {
    console.log(`Offsets.h path: ${process.argv[2]}`);
    console.log(`SDK source path: ${process.argv[3]}`);
    updateOffsets(process.argv[2], process.argv[3]);
} else {
    console.error("Not enough arguments passed!");
}

function updateOffsets(offsetsFile, sdkPath) {
    
} 