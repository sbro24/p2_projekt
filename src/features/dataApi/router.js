import { FileResponse } from "../../app/router.js";
import { CheckAuth } from "../../lib/cookies/sessionToken.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/api/data':
            if (await CheckAuth(req, res)) {
                let company = await GetCompanyProfileByToken(token)
                DataResponse(res, company);
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;
        default:
            break;
    }
}