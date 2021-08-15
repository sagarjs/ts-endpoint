import * as express from 'express';
import * as helmet from 'helmet';
import * as cors from 'cors'
import * as mongoose from 'mongoose'
import * as swaggerUi from 'swagger-ui-express'
import * as log4js from 'log4js'
import {RegisterRoutes} from './routes'
import {ServerError} from "./utils";

// Import Controllers that will be used to generate API Spec
import {StuffController} from "./controllers/stuff.ctrl"

export const DEVELOPMENT_ENV = `development`;
export const TEST_ENV = `test`;

process.env.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT_ENV;

export const MONGO_URI = `mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getir-case-study`;

log4js.configure('./log4js.json');

class App {
    public express: express.Express;
    private logger = log4js.getLogger("App");

    public constructor() {
        this.express = express();

        this.express.use(helmet());
        this.express.use(log4js.connectLogger(log4js.getLogger("http"), {level: 'auto'}));
        this.express.use(express.json());
        this.express.use(cors());

        this.logger.info("server started");

        this.connectToMongo();

        RegisterRoutes(this.express);
        this.express.get('/ping', (req, res) => {
            return res.send('pong');
        });

        this.defineErrorResponseFormat();

        const swaggerDocument = require('../swagger.json');
        this.express.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private async connectToMongo() {
        try {
            let uri = `${MONGO_URI}`;
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000
            });
            console.log('MongoDB Connected');
        } catch (error) {
            console.log(error);
            this.logger.info("server started");
        }
    }
    
    private defineErrorResponseFormat() {
        this.express.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
            const body: ServerError = {
                code: err.status || 500,
                msg: err.msg || 'Internal Server Error',
                internalServerErrors: err
            };
            res.status(body.code).json(body);
            next();
        });
    }
}

export default new App().express;
