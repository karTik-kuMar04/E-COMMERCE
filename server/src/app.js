import express from 'express';
import cors from 'cors';
import { env } from './config/index.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(helmet())
app.use(cors(
    {
        origin: env.CORS_ORIGIN,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Authorization"],
        maxAge: 600
    }
));



{/** ROUTEs */}
    // Auth Route
    import { authRouter } from './routes/auth.route.js';
    app.use("/api/auth", authRouter)

    // user route
    import { userRouter } from './routes/user.route.js';
    app.use("/user", userRouter)


    // /health check
    app.get('/health', (_, res) => {
        res.json({message: "API is running"})
    })

export default app