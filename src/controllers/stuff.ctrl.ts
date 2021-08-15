import {Body, Controller, Post, Route, Tags} from 'tsoa'
import {StuffService} from "../services/stuff.service";
import { StuffResponse, StuffRequest} from "../interfaces/stuff.i"
import { isMatch } from 'date-fns'
import { BadRequest } from '../utils';

@Route('api/v1/stuff/')
@Tags('Stuff')
export class StuffController extends Controller {

    @Post()
    public async getStuff(@Body() filter: StuffRequest): Promise<StuffResponse> {
        const date_format = 'yyyy-MM-dd'
        if (isMatch(filter.startDate, date_format) === false
        || isMatch(filter.endDate, date_format) === false){
            throw new BadRequest("Dates should be in yyyy-MM-dd format")
        }
        let records = await new StuffService().get(filter);
        const response: StuffResponse = {
            code: 0,
            msg: 'Success',
            records: records
        }
        return response
    }

}
