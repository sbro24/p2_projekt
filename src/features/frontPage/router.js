import { FileResponse } from "../../app/router.js";

export function router(req, res) {
    switch (req.url) {
        case '/':
            FileResponse(res, 'frontPage/frontPage.html');
            break;

        case '/frontPage/style.css':
            FileResponse(res, '/frontPage/style.css');
            break;
        

        default:
            break;
    }

}