import { FileResponse } from "../../app/router.js";


export function router(req, res, data) {
    switch (req.url) {
        case '/register':
            FileResponse(res, 'login/register.html')
            break;
        default:
            break;
    }
}