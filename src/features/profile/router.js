import { FileResponse } from "../../app/router.js";
import { CheckAuth } from "../../lib/cookies/sessionToken.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/profil/':
            if (await CheckAuth(req, res)) {
                FileResponse(res, 'profile/profil.html');
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;
        case '/api/profil/script/':
            FileResponse(res, 'profile/profil.js');
            break;
        default:
            break;
    }
}