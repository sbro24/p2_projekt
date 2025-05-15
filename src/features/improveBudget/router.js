import { FileResponse } from "../../app/router.js";
import { CheckAuth } from "../../lib/cookies/sessionToken.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/forstaaPrognoser/':
            if (await CheckAuth(req, res)) {
                FileResponse(res, 'improveBudget/forbedrBudget.html');
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;

        default:
            break;
    }
}