import { DataResponse, FileResponse } from "../../app/router.js";
import { CheckAuth } from "../../lib/cookies/sessionToken.js";
import { UpdateCompanyObject } from "../../lib/useDatabase/handle-data.js";

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
            const parsed = JSON.parse(data);
            await UpdateCompanyObject(parsed);
            DataResponse(res, { status: 'saved', entry: parsed });
            break

        default:
            break;
    }
}