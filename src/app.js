// import
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// import routes
import authRoute from "./modules/auth/auth.route.js";
import usersRoute from "./modules/users/users.route.js";
import vehiclesRoute from "./modules/vehicles/vehicles.route.js";
import ordersRoute from "./modules/orders/orders.route.js";       // La pista/cola
import servicesRoute from "./modules/services/services.route.js"; // El catálogo
import providersRoute from "./modules/providers/providers.routes.js"; // Proveedores
import inventoryRoute from "./modules/inventory/inventory.route.js"; // Químicos
import financeRoute from "./modules/finance/finance.route.js";    // Facturación y reportes

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(cors({
    // Permitir orígenes usados durante desarrollo (Vite puede usar 5173 o 5174)
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

/*
const globalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 60,
    message: {
        status: 429,
        error: 'Too many requests from this IP. Please try again in 5 minutes.',
        headers: {
            'Retry-After': 300
        }
    }
})
*/

// routers
const urlApiBase = '/api/lavautos';

// app.use(globalLimiter);
app.use(`${urlApiBase}/auth`, authRoute);
app.use(`${urlApiBase}/users`, usersRoute);
app.use(`${urlApiBase}/vehicles`, vehiclesRoute);
app.use(`${urlApiBase}/orders`, ordersRoute);
app.use(`${urlApiBase}/services`, servicesRoute);
app.use(`${urlApiBase}/providers`, providersRoute);
app.use(`${urlApiBase}/inventory`, inventoryRoute);
app.use(`${urlApiBase}/finance`, financeRoute);

export default app;