import { DataResponse, FileResponse } from "../../app/router.js";
import { Login } from "./login.js";

export function router(req, res, data) {
    switch (req.url) {
        case '/login/':
            FileResponse(res, 'login/login.html');
            break;
        case '/api/login/style/':
            FileResponse(res, 'login/login.css');
            break;
        case '/api/login/script/':
            FileResponse(res, 'login/login2.js');
            break;
        case '/api/login/submit/':
            Login(JSON.parse(data))
            .then(result => DataResponse(res, result.response, result.cookie))
            break;
        default:
            break;
    }
}