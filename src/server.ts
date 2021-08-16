import app from './app';
import * as fs from 'fs';
import * as http2 from 'spdy';

const port = process.env.PORT || 3000;

const server = app

server.listen(port, () => {
    console.info(`tserver running  on https://localhost:${port}`);
    console.info(`api documentation on https://localhost:${port}/api/doc`);
});