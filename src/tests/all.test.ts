import * as mongoose from 'mongoose'
import * as request from "supertest";
import app, { MONGO_URI } from "../app";
import { StuffResponse } from '../interfaces/stuff.i';

const stuffRequest = {
    startDate: "2015-01-01",
    endDate: "2017-01-01",
    minCount: 4000,
    maxCount: 5000
}

beforeAll(async () => {
    let uri = MONGO_URI
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    try {
        // Connection to Mongo killed.
        await mongoose.disconnect();

    } catch (error) {
        console.log(`
        Error in afterAll() of TEST environment: 
        ${error}
      `);
        throw error;
    }
});

describe("Server Online", () => {
    it("Ping Server", async () => {
        const response = await request(app).get("/ping");
        expect(response.text).toEqual("pong");
        expect(response.status).toEqual(200);
    });
});

describe('Stuff', () => {
    it("GET RECORDS", async () => {
        const response = await request(app)
        .post("/api/v1/stuff")
        .send(stuffRequest)
        let body = response.body as StuffResponse
        expect(response.status).toEqual(200)
        expect(body.code).toEqual(0)
        expect(body.records.length).toBeGreaterThan(0);

    })
})
