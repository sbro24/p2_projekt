import { FileResponse } from "../../app/router.js";
import fs from 'fs/promises';
import { UpdateCompanyObject } from "../../lib/useDatabase/handle-data.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/mineData':
            FileResponse(res, 'financialData/mineData.html');
            break;

        case '/api/financialData/saveData':
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