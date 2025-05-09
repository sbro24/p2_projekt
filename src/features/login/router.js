import { DataResponse, FileResponse } from "../../app/router.js";
import { Login } from "./login.js";

export function router(req, res, data) {
    switch (req.url) {
        case '/login':
            FileResponse(res, 'login/login.html');
            break;
        case '/api/login/style':
            FileResponse(res, 'login/login.css');
            break;
        case '/api/login/script':
            FileResponse(res, 'login/login.js');
            break;
        case '/api/login/submit':
            const result = Login(data);
            DataResponse(res, result);
            break;
        default:
            break;
    }
}