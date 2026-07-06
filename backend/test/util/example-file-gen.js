const {jsPDF} = require('jspdf');
const fs = require('fs/promises');
const path = require('path');
const {fs: fsFactory} = require('@zip.js/zip.js');

const answerSheetCount = parseInt(process.argv[2] ?? '120');
const filePerSheetCount = parseInt(process.argv[3] ?? '1');
const zipMode = (process.argv[4] ?? 'false') === 'true';
const firstId = parseInt(process.argv[5] ?? '9000001');
const fileNamePrefix = process.argv[6] ?? 'example-exam-';
const fileNameSuffix = process.argv[7] ?? '';
const outDir = process.argv[8] ?? './example-files';

const payloadImagePath = path.resolve('./test/util/example-payload-images');

fs.readdir(payloadImagePath).then(async payloadImages => {

    payloadImages = payloadImages.filter(img => img[0] !== '.');

    let zipFs;
    if(zipMode){
        zipFs = new fsFactory.FS();
    }

    for (let id = firstId; id < firstId + answerSheetCount; id++) {
        let directory;
        if(zipMode){
            directory = zipFs.addDirectory(fileNamePrefix + id + fileNameSuffix);
        }
        for(let i = 0; i < filePerSheetCount; i++) {
            let fileName;
            if(!zipMode) {
                fileName = fileNamePrefix + id + fileNameSuffix + (filePerSheetCount > 1 ? '_' + i : '') + '.pdf';
            } else {
                fileName = 'file' + (filePerSheetCount > 1 ? '_' + i : '') + '.pdf';
            }
            const doc = new jsPDF({
                orientation: "portrait",
                unit: 'mm',
            });
            doc.text(id.toString(), 105, 10, {align: "center"});
            if(filePerSheetCount > 1) doc.text("sheet " + i, 105, 20, {align: "center"});

            const randomImagePath = path.join(payloadImagePath, payloadImages[Math.floor(Math.random() * payloadImages.length)]);

            if (randomImagePath) {
                doc.addImage(await fs.readFile(randomImagePath, {encoding: 'base64'}), 'JPEG', 20 + 170, 120, 255, 170, undefined, undefined, 90);
            }

            if(!zipMode) {
                doc.save(path.join(outDir, fileName));
            } else {
                directory.addBlob(fileName, doc.output('blob'));
            }
        }
    }

    if(zipMode){
        //await zipWriter.close().then(zipBlob => {
        await fs.writeFile(path.join(outDir, 'example-files.zip'), await zipFs.exportUint8Array(), {encoding: 'binary'});
        //})
    }
});
