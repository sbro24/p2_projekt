import { FileResponse } from "../../app/router.js";

export function router(req, res, data) {
    switch (req.url) {
        case '/login':
            FileResponse(res, 'login/login.html');
            break;
        case '/api/login/style':
            FileResponse(res, 'login/login.css');
            break;
        case '/api/login/script':
            FileResponse(res, 'login/login.css');
            break;
        default:
            break;
    }
}