import { DataResponse, FileResponse } from "../../app/router.js";
import { CheckAuth } from "../../lib/cookies/sessionToken.js";
import { Login } from "./login.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/login/':
            if (await CheckAuth(req, res)) {
                FileResponse(res, 'profile/profil.html');
            } else {
                FileResponse(res, 'login/login.html');
            }
            break;
        case '/logout/':
            let cookie = 'sessionToken=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; Secure;';
            DataResponse(res, 'logout', cookie);
            break;
        case '/api/checkAuth/':
            if (await CheckAuth(req, res)) {
                DataResponse(res, 'true');
            } else {
                DataResponse(res, 'false');
            }
            break;
        case '/api/login/style/':
            FileResponse(res, 'login/login.css');
            break;
        case '/api/login/script/':
            FileResponse(res, 'login/login.js');
            break;
        case '/api/login/submit/':
            Login(JSON.parse(data))
            .then(result => DataResponse(res, result.response, result.cookie))
            break;
        default:
            break;
    }
}