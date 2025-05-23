import { FileResponse, DataResponse } from "../../app/router.js";
import { DeleteCompany, GetCompanyProfileByToken, GetFinancialDataById, UpdateCompanyName, UpdateCompanyObject, UpdateCompanyPassword } from "../../lib/useDatabase/handle-data.js";
import { CheckAuth, GetSessionToken } from "../../lib/cookies/sessionToken.js";
import { ValidatePassword, ValidateUsername } from "../../lib/dataValidation/validateObject.js";
import { DoesCompanynameExist } from "../register/register.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/api/global/style/':
            FileResponse(res, 'global/style.css');
            break;
        case '/api/global/export/':
            FileResponse(res, 'global/CSVExporter.js');
            break;
        case '/api/global/navbar/':
            FileResponse(res, 'global/navbar.js');
            break;
        case '/api/global/gentabel/':
            FileResponse(res, 'global/generateTables.js');
            break;
        case '/api/global/saveTables/':
            FileResponse(res, 'global/saveTables.js');
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
        case '/api/user/update/username/':
            if (await CheckAuth(req, res)) {
                if (!ValidateUsername(data) || await DoesCompanynameExist(data)) {
                    DataResponse(res, { status: 'failed', entry: data });
                    return
                }
                const token = GetSessionToken(req);
                let company = await GetCompanyProfileByToken(token)
                await UpdateCompanyName(company.id, data);
                DataResponse(res, { status: 'saved', entry: data });
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;
        case '/api/user/update/password/':
            if (await CheckAuth(req, res)) {
                if (!ValidatePassword(data)) {
                    DataResponse(res, { status: 'failed', entry: data });
                    return
                }
                const token = GetSessionToken(req);
                let company = await GetCompanyProfileByToken(token)
                await UpdateCompanyPassword(company.id, data);
                DataResponse(res, { status: 'saved', entry: data });
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;
        case '/api/user/delete/':
            if (await CheckAuth(req, res)) {
                if (!ValidateUsername(data)) {
                    DataResponse(res, { status: 'failed', entry: data });
                    return
                }
                const token = GetSessionToken(req);
                let company = await GetCompanyProfileByToken(token)
                if (company.name !== data) {
                    DataResponse(res, { status: 'failed', entry: data });
                    return
                } else {
                    await DeleteCompany(company.id);
                    DataResponse(res, { status: 'deleted', entry: data });
                }
                
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
            break;
        case '/api/calcForecast/':
            if (!await CheckAuth(req, res)) {
                FileResponse(res, 'login/needLogin.html');
                return
            }
            DataResponse(res, 'startedCalulation');
        case '/about/':
            FileResponse(res, 'global/about.html');
            break;
        default:
            break;
    }
}