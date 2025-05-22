import { DataResponse, FileResponse } from "../../app/router.js";
import { CheckAuth, GetSessionToken } from "../../lib/cookies/sessionToken.js";
import { GetCompanyProfileByToken, UpdateCompanyObject } from "../../lib/useDatabase/handle-data.js";
import { InitializeForecast } from "../calcForecast/ArimaForecast.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/mineData/':
            if (await CheckAuth(req, res)) {
                if (data) console.log('Data:', data);
                FileResponse(res, 'financialData/mineData.html');
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;

        case '/api/mineData/script/':
            FileResponse(res, 'financialData/mineData.js');
            break;

        case '/api/mineData/upload/':
            FileResponse(res, 'financialData/upload.js');
            break;

        case '/api/mineData/style/':
            FileResponse(res, 'financialData/mineData.css');
            break;
        case '/api/mineData/csvparser/':    
            FileResponse(res, 'financialData/CSVParser.js');
            break;

        case '/api/saveData/':
             if (!await CheckAuth(req, res)) {
                console.log('not logged in')
                DataResponse(res, 'not logged in');
                return;
            }
            const parsed = JSON.parse(data);
            await UpdateCompanyObject(parsed);

            const token = GetSessionToken(req);
            let company = await GetCompanyProfileByToken(token)
            console.log(parsed)
            DataResponse(res, { status: 'saved', entry: parsed });
            await InitializeForecast(company.id);
            break

        default:
            break;
    }
}