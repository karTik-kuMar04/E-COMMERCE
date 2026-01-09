import express from 'express';
import cors from 'cors';
import { env } from './config/index.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import bookRouter from './routes/books.route.js';
import systemRouter from './routes/system.route.js';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet({
    crossOriginResourcePolicy: false
}))
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,       // REQUIRED for cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    maxAge: 600,
  })
);
app.use(cookieParser())

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});



{/** ROUTEs */}

// Auth Route
app.use("/api/auth", authRouter);

// User Routes
app.use("/user", userRouter);

// Books Routes
app.use('/book', bookRouter);

app.use("/api/system", systemRouter);

// /health check
app.get('/health', (_, res) => {
    res.json({message: "API is running"})
})

export default app