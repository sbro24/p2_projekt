import { FileResponse, DataResponse } from "../../app/router.js";
import { GetCompanyProfileByToken, GetFinancialDataById } from "../../lib/useDatabase/handle-data.js";
import { CheckAuth, GetSessionToken } from "../../lib/cookies/sessionToken.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/api/global/style/':
            FileResponse(res, 'global/style.css');
            break;
        case '/api/global/navbar/':
            FileResponse(res, 'global/navbar.js');
            break;
        case '/api/global/gentabel/':
            FileResponse(res, 'global/generateTables.js');
            break;
        case '/api/user/profile/':
            if (await CheckAuth(req, res)) {
                const token = GetSessionToken(req);
                let company = await GetCompanyProfileByToken(token)
                DataResponse(res, company);
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;
        case '/api/user/data/':
            if (await CheckAuth(req, res)) {
                const token = GetSessionToken(req);
                let company = await GetCompanyProfileByToken(token)
                let data = await GetFinancialDataById(company.id)
                DataResponse(res, data);
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
        default:
            break;
    }
}