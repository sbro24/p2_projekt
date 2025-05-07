import { FileResponse } from "../../app/router.js";

export function router(req, res, data) {
    switch (req.url) {
        case '/login':
            FileResponse(res, 'login/html/login.html');
            break;
        case '/api/login/css':
            FileResponse(res, 'login/css/login.css');
            break;
        default:
            break;
    }
}