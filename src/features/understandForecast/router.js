import { FileResponse } from "../../app/router.js";
import { CheckAuth } from "../../lib/cookies/sessionToken.js";

export async function router(req, res, data) {
    switch (req.url) {
        case '/forstaaPrognoser/':
            if (await CheckAuth(req, res)) {
                FileResponse(res, 'understandForecast/forstaaPrognoser.html');
            } else {
                FileResponse(res, 'login/needLogin.html');
            }
            break;
        case '/api/forstaaPrognoser/style/':
            FileResponse(res, 'understandForecast/forstaaPrognoser.css');
            break;
        case '/api/forstaaPrognoser/script/':
            FileResponse(res, 'understandForecast/forstaaPrognoser.js');
            break;
        default:
            break;
    }
}