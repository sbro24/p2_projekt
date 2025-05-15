import { DataResponse, FileResponse } from "../../app/router.js";
import { Register } from "./register.js";


export function router(req, res, data) {
    switch (req.url) {
        case '/register/':
            FileResponse(res, 'login/register.html')
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