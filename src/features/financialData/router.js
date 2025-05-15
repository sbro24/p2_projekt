import { FileResponse } from "../../app/router.js";
import { CheckAuth } from "../../lib/cookies/sessionToken.js";
import { UpdateCompanyObject } from "../../lib/useDatabase/handle-data.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/mineData':
            if (await CheckAuth(req, res)) {
                FileResponse(res, 'financialData/mineData.html');
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;

        case '/api/mineData/script':
            FileResponse(res, 'financialData/mineData.js');
            break;
        
        case '/api/saveData':
            await SaveData(req, res, data)
        break

        default:
            break;
    }
}

async function SaveData(req, res, data) {
    const parsed = JSON.parse(data);
    await UpdateCompanyObject(parsed);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'saved', entry: parsed }));
}