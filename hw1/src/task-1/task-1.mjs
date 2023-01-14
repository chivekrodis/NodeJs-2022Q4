import { pipeline, Transform } from 'node:stream';
import { EOL } from 'node:os';

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        const data = chunk.toString().replace(EOL, '');
        const reversedData = data.split('').reverse().join('') + EOL;

        callback(null, reversedData);
    }
});

pipeline(
    process.stdin,
    transformStream,
    process.stdout,
    (error) => {
        if (error) {
            console.error(error);
        }
    }
)
