import axios from "axios";
import { Router } from "express";
import getGoogleClient from "../components/OAuthClients.js";
import Business from '../models/Business.js';
import GoogleCredential from "../models/GoogleCredential.js";
import Location from "../models/Location.js";
import User from "../models/User.js";

const BusinessRouter = Router();
// add typing

const googleClient = await getGoogleClient();

BusinessRouter.post("/", async (req, res) => {
    // creates a business with the requesting user as the owner
    const business = new Business({
        name: req.body.name
    });

    await business.save().catch(err => {
        console.error(err);
        res.status(500).send("Error creating business");
        return;
    });

    const user = await User.findById(req.session.userId);
    user.memberOf.push({ type: "admin", business: business._id });
    await user.save().catch(err => {
        console.error(err);
        res.status(500).send("Error creating business");
        return;
    });

    res.json(business);
});

BusinessRouter.get("/", async (req, res) => {
    // returns all businesses that the requesting user is a member of
    const user = await User.findById(req.session.userId, "memberOf.business memberOf.type").populate("memberOf.business");

    res.json(user.memberOf);
});

BusinessRouter.get('/:business/locations', async (req, res) => {
    const locations = await Location.find({ business: req.params.business })

    res.json(locations);
})

BusinessRouter.get('/:business/locations/potential', async (req, res) => {
    const user = await User.findById(req.session.userId)

    const googleCredentialID = user.credentials.find(e => e.type == "GoogleCredential")
    const googleCredential = await GoogleCredential.findById(googleCredentialID.credential);

    console.log(googleCredential)

    const tokenSet = await googleClient.refresh(googleCredential.refreshToken);
    const result = await axios({
        headers: {
            Authorization: `Bearer ${tokenSet.access_token}`
        },
        method: "GET",
        url: "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    })

    res.json(result)
})

// BusinessRouter.post('/:business/location', async (req, res) => {

// });

export default BusinessRouter;