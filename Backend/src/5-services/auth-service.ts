import { OkPacket } from "mysql";
import cyber from "../2-utils/cyber";
import dal from "../2-utils/dal";
import { AuthenticationError, ValidationError } from "../4-models/client-errors";
import CredentialsModel from "../4-models/credentials-model";
import RoleModel from "../4-models/role-model";
import UserModel from "../4-models/user-model";

async function register(user: UserModel): Promise<string> {

    user.validate();

    // If email token:
    if (await isEmailTaken(user.email)) throw new ValidationError(`Email ${user.email} already taken`);

    // New USer is a USer role:
    user.role = RoleModel.User;

    // Hash Password:
    user.password = cyber.hashPassword(user.password);

    // Create sql query:
    const sql = `INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, ?)`;

    // Add to database:
    const result: OkPacket = await dal.execute(sql, user.firstName, user.lastName, user.email, user.password, user.role);

    // Set back id:
    user.userId = result.insertId;

    const token = cyber.createNewToken(user);

    return token;
}

async function login(credentials: CredentialsModel): Promise<string> {

    credentials.validate();

    // Hash Password:
    credentials.password = cyber.hashPassword(credentials.password);

    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;

    // Execute query:
    const users = await dal.execute(sql, credentials.email, credentials.password);

    // Extract user:
    const user = users[0];

    // If credentials are wrong:
    if (!user) throw new AuthenticationError("Incorrect email or password");

    const token = cyber.createNewToken(user);

    return token;

}

async function isEmailTaken(email: string): Promise<boolean> {

    // Create sql query:
    const sql = `SELECT EXISTS(SELECT email FROM users WHERE email = ?) as isExist`;

    // Execute query:
    const arr = await dal.execute(sql, email);

    // Extract count:
    const count = +arr[0].count;

    return count > 0;
}

export default {
    register,
    login
}