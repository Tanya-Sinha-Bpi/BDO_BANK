import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import routes from './Routes/index.js';
import path from "path";
const __dirname = path.resolve();
dotenv.config();
const app = express();

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3000,
    message: "Too many Requests from this IP, please try again in an hour!",
  });

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        scriptSrcElem: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://fonts.googleapis.com",
        ],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"], // Updated for Cloudinary
        fontSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://fonts.gstatic.com",
          "data:",
        ],
        connectSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "https://mybpi.online",
          "https://www.mybpi.online",
          "https://fonts.gstatic.com",
          "https://api.iconify.design",
          "https://api.simplesvg.com",
          "https://api.unisvg.com",
          "https://bpi-bank-system.onrender.com",
          "http://localhost:7878",
          "https://bpi-bank.onrender.com",
          "https://bdo-bank.onrender.com",
          "https://frontend-ljs5x2y6b-amans-projects-74f8e6dc.vercel.app",
          "https://frontend-mdjpxev3z-amans-projects-74f8e6dc.vercel.app",
          "https://frontend-mdjpxev3z-amans-projects-74f8e6dc.vercel.app/",
          "https://frontend-5ctzwjj4x-amans-projects-74f8e6dc.vercel.app",
          "https://frontend-rose-seven-64.vercel.app",
          "https://www.bdoonline.online",
          "http://localhost:8081"
        ],
      },
    })
  );

  const allowedOrigins = [
    "https://bdo-bank.onrender.com",
    "http://localhost:7272",
    "http://localhost:5173",
    "http://10.0.2.2:7272",
    "https://frontend-ljs5x2y6b-amans-projects-74f8e6dc.vercel.app",
    "https://frontend-mdjpxev3z-amans-projects-74f8e6dc.vercel.app",
    "https://frontend-mdjpxev3z-amans-projects-74f8e6dc.vercel.app/",
    "https://frontend-5ctzwjj4x-amans-projects-74f8e6dc.vercel.app",
    "https://frontend-rose-seven-64.vercel.app",
    "https://www.bdoonline.online",
    "http://localhost:8081",
    "https://frontend-rose-seven-64.vercel.app"
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin === "*") {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "X-Custom-Header",
      ],
    })
  );

app.use(process.env.ORIGIN, limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(mongoSanitize());
app.use(cookieParser());

app.use(xss());

//Routes
app.use("/api/v1",routes);

app.use(express.static(path.join(__dirname, "/NeuraReadAdmin/dist")));
console.log(path.join(__dirname, "/NeuraReadAdmin/dist")); // Path verification

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "NeuraReadAdmin", "dist", "index.html"));
});

export default app;
