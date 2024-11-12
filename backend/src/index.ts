import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {DataSource} from "typeorm";
import cors from "cors";
import bodyParser from "body-parser";
import { Player } from "./entities/playerEntity";
import { playerRouter } from "./routes/playerRouter";
import { User } from "./entities/userEntity";
import cookieParser from 'cookie-parser';





// Instantiate express app
const app: Express = express();
dotenv.config();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow methods
    allowedHeaders: ['Content-Type', 'Authorization','credentials'], // Allow headers
    credentials: true // Allow credentials (cookies)
}));
app.options('*', cors());

export const AppDataSource = new DataSource({
    type: "postgres",
    //host: process.env.PGHOST || "mypostgres",
    //port: 5432,
    url: process.env.DATABASE_URL,
    //port: parseInt(process.env.PORT!),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: "assignment_data",
    entities: [Player, User],
    synchronize: true,
    extra: {
        max: 20, // Set the maximum number of connections in the pool
       // min: 1,  // Set the minimum number of connections in the pool
       // idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    },
});

// Define sever port
const port = process.env.PORT;
console.log(process.env.PORT);
// Create a default route.
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


AppDataSource.initialize().then(() => {
    // Start listening to the requests on the defined port
    app.listen(port);
    console.log("datasource has been initialized");
}).catch((err) => {
    console.log("error during datasource initialization: ", err);
});


app.use('/',playerRouter);
