const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

const pdfs = [
    "c:\\Users\\Hoang Cuong\\Desktop\\khải\\aptis\\mock_tests\\TỰ HỌC APTIS GV - QUOC ANH APTIS SV.pdf",
    "c:\\Users\\Hoang Cuong\\Desktop\\khải\\aptis\\mock_tests\\Grammar-ver3 (1).pdf",
    "c:\\Users\\Hoang Cuong\\Desktop\\khải\\aptis\\mock_tests\\Grammar-ver-2 (2).pdf",
    "c:\\Users\\Hoang Cuong\\Desktop\\khải\\aptis\\mock_tests\\GRAMMAR-APTIS-VER-1.pdf"
];

const outputDir = "c:\\Users\\Hoang Cuong\\Desktop\\khải\\aptis\\tmp\\extracted_texts";
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function extractFile(filePath) {
    console.log(`Extracting ${filePath}...`);
    try {
        const dataBuffer = fs.readFileSync(filePath);
        let text = "";

        // Check for ZIP/DOCX header (PK)
        if (dataBuffer[0] === 0x50 && dataBuffer[1] === 0x4B) {
            console.log("Detected ZIP/DOCX format. Using mammoth...");
            const result = await mammoth.extractRawText({ buffer: dataBuffer });
            text = result.value;
        } else {
            console.log("Detected PDF format. Using pdf-parse...");
            const data = await pdf(dataBuffer);
            text = data.text;
        }

        const filename = path.basename(filePath).replace('.pdf', '.txt');
        const outputPath = path.join(outputDir, filename);
        fs.writeFileSync(outputPath, text);
        console.log(`Success! Data written to ${outputPath}`);
    } catch (error) {
        console.error(`Error extracting ${filePath}: ${error.message}`);
    }
}

async function run() {
    for (const filePath of pdfs) {
        await extractFile(filePath);
    }
    console.log("ALL_DONE");
}

run();
