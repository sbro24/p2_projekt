import { DataResponse, FileResponse } from "../../app/router.js";
import { CheckAuth } from "../../lib/cookies/sessionToken.js";
import { Register } from "./register.js";


export async function router(req, res, data) {
    switch (req.url) {
        case '/register/':
            if (await CheckAuth(req, res)) {
                FileResponse(res, 'profile/profil.html');
            } else {
                FileResponse(res, 'login/register.html')
            }
            break;
        case '/api/register/script/':
            FileResponse(res, 'login/register.js')
            break;
        case '/api/register/submit/':
            Register(JSON.parse(data))
            .then(result => {
                console.log('register result: ', result);
                DataResponse(res, result.response)
            })
            break;
        default:
            break;
    }
}