import { Issuer } from "openid-client";

export default async function getGoogleClient() {
    const googleIssuer = await Issuer.discover("https://accounts.google.com");
    return new googleIssuer.Client({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_SECRET,
        redirect_uris: [process.env.URL + "/api/auth/google/callback"],
        response_types: ["code"]
    });
}