import { FileResponse } from "../../app/router.js";
import { CheckAuth } from "../../lib/cookies/sessionToken.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/minSide/':
            if (await CheckAuth(req, res)) {
                FileResponse(res, 'userData/minSide.html');
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;
        default:
            break;
    }
}