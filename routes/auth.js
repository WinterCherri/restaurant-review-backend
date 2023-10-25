import { compare } from 'bcrypt';
import { Router } from "express";
import { generators } from "openid-client";
import getGoogleClient from "../components/OAuthClients.js";
import GoogleCredential from "../models/GoogleCredential.js";
import User from "../models/User.js";

const AuthRouter = Router();
const googleClient = await getGoogleClient();

// this route shows methods available for a user to login with
AuthRouter.get("/methods", async (req, res) => {
    const { email, id } = req.query;
    if (!email && !id) {
        res.status(400).send("Missing email and id parameter");
        return;
    }

    const user = await User.findOne({ email, id });
    if (!user) {
        res.status(404).send("User not found");
        return;
    }
    const methods = user.credentials.map(cr => cr.type);
    res.send(methods);
})

// this starts the login process for a user to login with google
AuthRouter.get("/login/GoogleCredential", (req, res) => {
    if (req.params.redirect) {
        req.session.redirect = req.params.redirect;
    }

    const codeVerifier = generators.codeVerifier();
    const codeChallenge = generators.codeChallenge(codeVerifier);
    const url = googleClient.authorizationUrl({
        scope: "openid email https://www.googleapis.com/auth/business.manage",
        response_type: 'code',
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.URL + "/api/auth/callback/GoogleCredential",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        access_type: 'offline'
    });
    req.session.codeVerifier = codeVerifier;
    res.redirect(url);
});

// this handles a post request to login with a password
AuthRouter.post("/login/PasswordCredential", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send("Missing email or password");
        return;
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404).send("User not found");
        return;
    }

    const passwordCredential = user.credentials.find(cr => cr.type === "PasswordCredential");
    if (!passwordCredential) {
        res.status(500).send("User does not have a PasswordCredential credential");
        return;
    }
    const passwordCredentialFromDB = await PasswordCredential.findById(passwordCredential.credential);
    if (!passwordCredentialFromDB) {
        res.status(500).send("User does not have a PasswordCredential credential saved to the database");
        return;
    }

    const valid = await compare(password, passwordCredentialFromDB.password);
    if (!valid) {
        res.status(401).send("Invalid password");
        return;
    }

    req.session.userId = user._id;
    res.send(user);
})

// this handles the callback from google
AuthRouter.get("/callback/GoogleCredential", async (req, res) => {
    let params, tokenSet, credential;
    try {
        params = googleClient.callbackParams(req);
        tokenSet = await googleClient.callback(process.env.URL + "/api/auth/callback/GoogleCredential", params, {
            response_type: 'code',
            code_verifier: req.session.codeVerifier,
        });
        credential = await googleClient.userinfo(tokenSet.access_token);
    } catch (e) {
        return res.status(400).send(e.error)
    }
    const user = await User.findOne({ email: credential.email });
    if (user) {
        // sign this user in
        // check that the user has a GoogleCredential credential
        const googleCredential = user.credentials.find(cr => cr.type === "GoogleCredential");
        if (!googleCredential) {
            res.status(500).send("User does not have a GoogleCredential credential");
            return;
        }
        const googleCredentialFromDB = await GoogleCredential.findById(googleCredential.credential);
        if (!googleCredentialFromDB) {
            res.status(500).send("User does not have a GoogleCredential credential");
            return;
        }
        req.session.userId = user._id;
    } else {
        // create a new user
        const newGoogleCredential = new GoogleCredential({
            refreshToken: tokenSet.refresh_token,
            profileId: credential.sub
        });

        await newGoogleCredential.save();
        const newUser = new User({
            email: credential.email,
            photo: credential.picture,
            credentials: [{
                credential: newGoogleCredential._id,
                type: 'GoogleCredential'
            }]
        });
        await newUser.save();

        req.session.userId = newUser._id;
    }
    const callback = req.session.callback;
    if (callback) {
        delete req.session.callback;
        res.redirect(callback);
    } else {
        res.redirect("/");
    }
});

export default AuthRouter;