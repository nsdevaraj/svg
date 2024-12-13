const fs = require('fs').promises;
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

async function createSvgCsv() {
    try {
        // Read all files in the current directory
        const files = await fs.readdir(__dirname);
        const svgFiles = files.filter(file => path.extname(file).toLowerCase() === '.svg');

        // Create CSV writer
        const csvWriter = createObjectCsvWriter({
            path: 'svg-data.csv',
            header: [
                { id: 'filename', title: 'Filename' },
                { id: 'content', title: 'SVG Content' }
            ]
        });

        // Process each SVG file
        const records = await Promise.all(svgFiles.map(async (filename) => {
            const content = await fs.readFile(path.join(__dirname, filename), 'utf8');
            return {
                filename: filename.split('.')[0],
                content: `data:image/svg+xml;utf8,${content.replace(/[\n]+/g, ' ').trim()}`.replace(/"/g, "'")
            };
        }));

        // Write to CSV
        await csvWriter.writeRecords(records);
        console.log(`Successfully created svg-data.csv with ${records.length} SVG files`);

    } catch (error) {
        console.error('Error:', error);
    }
}

createSvgCsv();
