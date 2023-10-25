import { Issuer } from "openid-client";

let googleClient = null;
/**
 * @typedef {import('openid-client').Client} Client
 */

/**
 * 
 * @returns {Promise<Client>} google client
 */
export default async function getGoogleClient() {
    if (googleClient == null) {
        const googleIssuer = await Issuer.discover("https://accounts.google.com");
        googleClient = new googleIssuer.Client({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_OAUTH_SECRET,
            redirect_uris: [process.env.URL + "/api/auth/google/callback"],
            response_types: ["code"]
        });
    }
    return googleClient;
}