import { FileResponse } from "../../app/router.js";

export function router(req, res) {
    switch (req.url) {
        case '/':
            FileResponse(res, 'frontPage/frontPage.html');
            break;

        default:
            break;
    }

}