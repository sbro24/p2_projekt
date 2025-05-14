import { FileResponse, DataResponse } from "../../app/router.js";
import {  GetFinancialDataById } from "../../lib/useDatabase/handle-data.js";

export function router(req, res, data) {
    switch (req.url) {
        case '/api/global/style':
            FileResponse(res, 'global/style.css');
            break;
        case '/api/global/navbar':
            FileResponse(res, 'global/navbar.js');
            break;
        case '/api/global/gentabel':
            FileResponse(res, 'global/generateTables.js');
            break;
        default:
            break;
    }
}