const {jsPDF} = require('jspdf');
const fs = require('fs/promises');
const path = require('path');

const fileCount = parseInt(process.argv[2] ?? '120');
const firstId = parseInt(process.argv[3] ?? '9000001');
const fileNamePrefix = process.argv[4] ?? 'example-exam-';
const fileNameSuffix = process.argv[5] ?? '';
const outDir = process.argv[6] ?? './example-files';

const payloadImagePath = path.resolve('./test/util/example-payload-images');

fs.readdir(payloadImagePath).then(async payloadImages => {

    payloadImages = payloadImages.filter(img => img[0] !== '.');

    for (let id = firstId; id < firstId + fileCount; id++) {
        const fileName = fileNamePrefix + id + fileNameSuffix + '.pdf';
        const doc = new jsPDF({
            orientation: "portrait",
            unit: 'mm',
        });
        doc.text(id.toString(), 105, 20, {align: "center"});

        const randomImagePath = path.join(payloadImagePath, payloadImages[Math.floor(Math.random() * payloadImages.length)]);

        if(randomImagePath) {
            doc.addImage(await fs.readFile(randomImagePath, {encoding: 'base64'}), 'JPEG', 20 + 170, 120, 255, 170, undefined, undefined, 90);
        }

        doc.save(path.join(outDir, fileName));
    }

});
