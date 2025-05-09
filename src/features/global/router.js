import { FileResponse } from "../../app/router.js";

export function router(req, res, data) {
    switch (req.url) {
        case '/api/global/style':
            FileResponse(res, 'global/style.css');
            break;
        case '/api/global/navbar':
            FileResponse(res, 'global/navbar.js');
            break;
        default:
            break;
    }
}