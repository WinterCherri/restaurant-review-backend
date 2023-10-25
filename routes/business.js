import { Router } from "express";
import Business from '../models/Business.js';

const BusinessRouter = Router();

BusinessRouter.post("/", (req, res) => {
    // creates a business with the requesting user as the owner
    const business = new Business({
        name: req.body.name,
        members: [{
            type: "admin",
            user: req.user._id
        }]
    });

    business.save()
        .then(business => {
            res.json(business);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

export default BusinessRouter;