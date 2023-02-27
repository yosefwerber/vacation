import express from "express";
import expressFileUpload from "express-fileupload";
import cors from "cors";
import appConfig from "./2-utils/appConfig";
import catchAll from "./3-middleware/catch-all";
import routeNotFound from "./3-middleware/route-not-found";
import authRoutes from "./6-routes/auth-routes";
import VacationRoutes from "./6-routes/vacation-routes";

const server = express();

server.use(cors());
server.use(express.json());
server.use(expressFileUpload());
server.use("/api", authRoutes);
server.use("/api", VacationRoutes);
server.use(routeNotFound);
server.use(catchAll);

server.listen(appConfig.port, () => console.log(`Listening on http://localhost:${appConfig.port}`));