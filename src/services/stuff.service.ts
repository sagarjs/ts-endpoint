import { InternalServerError, ServerError } from "../utils";
import * as log4js from "log4js";
import { StuffRepository } from "../repositories/stuff.repo";
import { Stuff, StuffRequest } from "../interfaces/stuff.i";

export class StuffService {
    private logger = log4js.getLogger("StuffService");

    public async get(filter: StuffRequest): Promise<Stuff[]> {
        try {
            const startDate = new Date(filter.startDate)
            const endDate = new Date(filter.endDate)
            const minCount = filter.minCount
            const maxCount = filter.maxCount

            const filterByDate = {
                '$match': {
                    '$and': [
                        {createdAt: {'$gt': startDate}},
                        {createdAt: {'$lt': endDate}},
                    ]
                }
            }
            const projectFields = {
                '$project': {
                    key: 1,
                    createdAt:  1,
                    totalCount: {
                        '$sum': '$counts'
                    }
                }
            }

            const filterTotalCount = {
                '$match': {
                    '$and': [
                        { totalCount: { '$gt': minCount } },
                        { totalCount: { '$lt': maxCount } }
                    ]
                }
            }
            
            let stuff: Stuff[] = await StuffRepository.aggregate([
                filterByDate,
                projectFields, 
                filterTotalCount,
            ])
            
            if (!stuff) this.handleError(null);
            return stuff
        } catch (error) {
            this.handleError(error);
        }
    }

    public handleError(error: any) {
        console.error(error);
        this.logger.error(error);
        if (error instanceof ServerError) throw error;
        const invalidId = 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters';
        if (!error || error.message == invalidId) {
            throw new ServerError(404);
        } else if (error.name === 'MongoError' && error.code === 11000) {
            throw new ServerError(409);
        } else {
            throw new ServerError(500, [new InternalServerError(error.message, error.stack)]);
        }
    }
}