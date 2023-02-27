class AppConfig {

    public port = 4000;
    public mysqlHost = "localhost";
    public mysqlUser = "root";
    public mysqlPassword = "";
    public mysqlDatabase = "vacationsDatabase";
    public userImageURL = "http://localhost:4000/api/users/vacations/image/"
}

const appConfig = new AppConfig()

export default appConfig;