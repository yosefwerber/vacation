import express, { Request, Response, NextFunction } from "express";
import cyber from "../2-utils/cyber";
import imageHandler from "../2-utils/image-handler";
import verifyAdmin from "../3-middleware/verify-admin";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import VacationModel from "../4-models/vacation-model";
import vacationsService from "../5-services/vacations-service";

const router = express.Router();

// Get http://localhost:4000/api//users/vacations
router.get("/users/vacations", verifyLoggedIn,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = cyber.getUserFromToken(request);
        const vacations = await vacationsService.getAllVacationsForUser(user);
        response.json(vacations);

    }
    catch (err: any) {
        next(err);
    }
});


// User Follow vacation
// POST http://localhost:4000/api//users/follow/:vacationId
router.post("/users/follow/:vacationId([0-9]+)", verifyLoggedIn,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = cyber.getUserFromToken(request);
        const vacationId = +request.params.vacationId;
        await vacationsService.follow(user.userId, vacationId);
        response.sendStatus(201);
    }
    catch (err: any) {
        next(err);
    }
});



//User Unfollow vacation
// DELETE http://localhost:4000/api//users/follow/:vacationId
router.delete("/users/follow/:vacationId([0-9]+)", verifyLoggedIn,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = cyber.getUserFromToken(request);
        const vacationId = +request.params.vacationId;
        await vacationsService.unfollow(user.userId, vacationId);
        response.sendStatus(204);

    }
    catch (err: any) {
        next(err);
    }
});





// ----------------------Admin Zone -------------------------------------------
// Get http://localhost:4000/api/admin/vacations
router.get("/admin/vacations", verifyAdmin,  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = cyber.getUserFromToken(request);
        const vacations = await vacationsService.getAllVacationsForAdmin(user);
        response.json(vacations);

    }
    catch (err: any) {
        next(err);
    }
});



// POST http://localhost:4000/api/admin/vacations
router.post("/admin/vacations/", verifyAdmin ,async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.image;
        const vacation = new VacationModel(request.body);
        const addedVacation = await vacationsService.addVacation(vacation);
        response.status(201).json(addedVacation);

    }
    catch (err: any) {
        next(err);
    }
});

// PUT http://localhost:4000/api/admin/vacations/:id
router.put("/admin/vacations/:id([0-9]+)", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.id = +request.params.id;
        request.body.image = request.files?.image;
        const vacation = new VacationModel(request.body);
        const updatedVacation = await vacationsService.updateVacation(vacation);
        response.json(updatedVacation);
    }
    catch (err: any) {
        next(err);
    }
});

// DELETE http://localhost:4000/api/admin/vacations/:id([0-9]+
router.delete("/admin/vacations/:id([0-9]+)", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const vacationId = +request.params.id;
        await vacationsService.deleteVacation(vacationId);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/users/vacations/image/:imageFile", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const imageFile = request.params.imageFile;
        const absolutePath = imageHandler.getAbsolutePath(imageFile);
        response.sendFile(absolutePath)
    } catch (err: any) {
        next(err)
    }
})


export default router;