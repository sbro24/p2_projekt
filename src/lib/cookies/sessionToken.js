import { request } from "http";
import { RandomIntFromInterval } from "../maths/random.js";
import { GetCompanyies } from "../useDatabase/handle-data.js";
import { FileResponse } from "../../app/router.js";

export function GenSessionToken() {
    let result = '';
    const n = 20
    const chars = '1234567890abcdefghifklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
    const min = 0
    const max = chars.length - 1
    for (let i = 0; i < n; i++) {
        result += chars.charAt(RandomIntFromInterval(min, max));
    }
    return result
}

export function CheckAuth(req, res) {
    return new Promise(async (resolve) => {
        const cookies = GetCookies(req);
        const companies = await GetCompanyies();
        for (const company of companies) {
            if (company.sessionToken === cookies.sessionToken) {
                resolve(true)
            }
        }
        resolve(false)
    });
}

export function GetSessionToken(req) {
    const cookies = GetCookies(req);
    if (!cookies.sessionToken) return '';
    return cookies.sessionToken
}

function GetCookies(req) {
    let result = {};
    let cookies = req.headers.cookie;
    if (!cookies) return result
    cookies.split('; ').forEach(cookie => {
        cookie = cookie.split('=');
        result[cookie[0]] = cookie[1];
    });
    return result
}

