import { DataResponse, FileResponse } from "../../app/router.js";
import { CheckAuth, GetSessionToken } from "../../lib/cookies/sessionToken.js";
import { GetCompanyProfileByToken, GetFinancialDataById } from "../../lib/useDatabase/handle-data.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/api/user/profile':
            if (await CheckAuth(req, res)) {
                const token = GetSessionToken(req);
                let company = await GetCompanyProfileByToken(token)
                DataResponse(res, company);
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;
        case '/api/user/data':
            if (await CheckAuth(req, res)) {
                const token = GetSessionToken(req);
                let company = await GetCompanyProfileByToken(token)
                let data = await GetFinancialDataById(company.id)
                DataResponse(res, data);
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;
        default:
            break;
    }
}