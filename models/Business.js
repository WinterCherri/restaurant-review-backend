import { Schema, model } from "mongoose";

const businessSchema = new Schema({
    name: String
});

const Business = model("Business", businessSchema);

export default Business;