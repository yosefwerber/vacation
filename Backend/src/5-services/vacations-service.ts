import { OkPacket } from "mysql";
import appConfig from "../2-utils/appConfig";
import dal from "../2-utils/dal";
import imageHandler from "../2-utils/image-handler";
import { ResourceNotFoundError } from "../4-models/client-errors";
import UserModel from "../4-models/user-model";
import VacationModel from "../4-models/vacation-model";

async function getAllVacationsForUser(user: UserModel): Promise<VacationModel[]> {


    const sql = `
        SELECT DISTINCT V.*,
            EXISTS(SELECT * FROM followers WHERE vacationId = F.vacationId and userId = ?) AS isFollowing,
            COUNT(F.userId) as followersCount,
            CONCAT('${appConfig.userImageURL}', imageFile) AS imageFile
        FROM vacations as V LEFT JOIN followers AS F
        ON V.vacationId = F.vacationId
        GROUP BY vacationId
        ORDER BY startDate

    `;
    const vacations = await dal.execute(sql, user.userId);
    return vacations;
}

async function getAllVacationsForAdmin(user: UserModel): Promise<VacationModel[]> {


    const sql = "SELECT * FROM vacations ORDER BY startDate";
    const vacations = await dal.execute(sql, user.userId);
    return vacations;
}



async function addVacation(vacation: VacationModel): Promise<VacationModel> {
    vacation.validatePost();

    vacation.imageName = await imageHandler.saveImage(vacation.image);

    const sql = "INSERT INTO vacations VALUES(DEFAULT, ? , ? , ? , ? , ?, ?)";
    const result: OkPacket = await dal.execute(sql, vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price, vacation.imageName);
    vacation.vacationId = result.insertId;
    delete vacation.image;
    return vacation;
}

// Update existing Vacation:
async function updateVacation(vacation: VacationModel): Promise<VacationModel> {

    vacation.validatePut();

    // Get image name from database: 
    vacation.imageName = await getImageNameFromDB(vacation.vacationId);

    // Update existing image:
    if (vacation.image) {
        vacation.imageName = await imageHandler.updateImage(vacation.image, vacation.imageName);
    }

    // Create sql query: 
    const sql =`
        UPDATE vacations 
        SET 
            destination = ?,
            description = ?,
            startDate =?,
            endDate = ?,
            price = ?,
            imageFile = ?
        WHERE vacationId = ?
    `;

    // Execute query: 
    const result: OkPacket = await dal.execute(
        sql, 
        vacation.destination, 
        vacation.description, 
        vacation.startDate, 
        vacation.endDate, 
        vacation.price, 
        vacation.imageName, 
        vacation.vacationId
        );

    // If product not exist:
    if (result.affectedRows === 0) throw new ResourceNotFoundError(vacation.vacationId);

    // Delete image property (which is the sent file object) from vacation object:
    delete vacation.image;

    // Return updated vacation:
    return vacation;
}

// Delete existing vacation:
async function deleteVacation(vacationId: number): Promise<void> {

    // Get image name from database: 
    const imageName = await getImageNameFromDB(vacationId);

    // Delete that image from hard-disk: 
    imageHandler.deleteImage(imageName);

    // Create sql query: 
    const sql = `DELETE FROM vacations WHERE vacationId = ${vacationId}`;

    // Execute query: 
    const result: OkPacket = await dal.execute(sql);

    // If id not exists:
    if (result.affectedRows === 0) throw new ResourceNotFoundError(vacationId);
}

// Get image name from database: 
async function getImageNameFromDB(id: number): Promise<string> {

    // Create sql query:
    const sql = `SELECT imageFile FROM vacations WHERE vacationID = ${id}`;

    // Get object array:
    const vacations = await dal.execute(sql);

    // Extract single product: 
    const vacation = vacations[0];

    // If no such product: 
    if (!vacation) return null;

    // Return image name:
    return vacation.imageName;
}



async function follow(userId: number, vacationId: number): Promise<void> {
    const sql = `INSERT INTO followers VALUES(?, ?)`;
    await dal.execute(sql, userId, vacationId);
}

async function unfollow(userId: number, vacationId: number): Promise<void> {
    const sql = `DELETE FROM followers WHERE userId = ? AND vacationID = ?`;
    await dal.execute(sql, userId, vacationId);
}


// -------------------------------


export default {
    getAllVacationsForUser,
    addVacation,
    deleteVacation,
    getAllVacationsForAdmin,
    follow,
    unfollow,
    updateVacation
}