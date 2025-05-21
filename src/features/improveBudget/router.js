import { FileResponse } from "../../app/router.js";
import { CheckAuth } from "../../lib/cookies/sessionToken.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/forbedrBudget/':
            if (await CheckAuth(req, res)) {
                FileResponse(res, 'improveBudget/forbedrBudget.html');
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;

        case '/api/improveBudget/script/':
            FileResponse(res, 'improveBudget/forbedrBudget.js');
            break;

        case '/api/improveBudget/style/':
            FileResponse(res, 'improveBudget/forbedrBudget.css');
            break;

          case '/api/saveData/':
             if (!await CheckAuth(req, res)) {
                console.log('not logged in')
                DataResponse(res, 'not logged in');
                return;
            }

        case '/api/improveBudget/genTabel/':
            FileResponse(res, 'global/generateTables.js');
            break;

        default:
            break;
    }
}