import { createWriteStream, createReadStream } from 'node:fs';
import { pipeline } from 'node:stream';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import csvToJson from 'csvtojson';

const __filePath = fileURLToPath(import.meta.url);
const __dirname = dirname(__filePath);

const readStream = createReadStream(__dirname + '/csv/data.csv')
    .on('error', (error) => {
        console.log(error);
    });

const writeStream = createWriteStream(__dirname + '/json.txt')
    .on('error', (error) => {
        console.log(error);
    });

pipeline(
    readStream,
    csvToJson({
        colParser: {
            "Amount": "omit",
        }
    }),
    writeStream,
    (error) => {
        if (error) {
            console.error(error);
        }
    }
)
