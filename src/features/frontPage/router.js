import { FileResponse } from "../../app/router.js";

export function router(req, res) {
    switch (req.url) {
        case '/':
            FileResponse(res, 'frontPage/frontPage.html');
            break;
        case '/api/frontPage/script/':
            FileResponse(res, 'frontPage/frontPage.js');
            break;

        default:
            break;
    }

}