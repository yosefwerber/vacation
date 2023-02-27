class AppConfig {
     // Note - Remember the ending /
    public vacationsUrl = "http://localhost:4000/api/users/vacations/";
    public followUrl = "http://localhost:4000/api/users/follow/";
    public adminVacationsUrl = "http://localhost:4000/api/admin/vacations/";
    public registerUrl = "http://localhost:4000/api/auth/register/";
    public loginUrl = "http://localhost:4000/api/auth/login/";
}

const appConfig = new AppConfig();

export default appConfig;
