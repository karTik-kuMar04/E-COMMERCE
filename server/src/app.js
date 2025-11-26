import express from 'express';
import cors from 'cors';
import { env } from './config/index.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import bookRouter from './routes/books.route.js';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet({
    crossOriginResourcePolicy: false
}))
app.use(
  cors({
    origin: env.CORS_ORIGIN, // must be exactly http://localhost:3000
    credentials: true,       // REQUIRED for cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    maxAge: 600,
  })
);
app.use(cookieParser())




{/** ROUTEs */}
    // Auth Route
    
    app.use("/api/auth", authRouter)

    // user route
    
    app.use("/user", userRouter)


    // /health check
    app.get('/health', (_, res) => {
        res.json({message: "API is running"})
    })

export default app