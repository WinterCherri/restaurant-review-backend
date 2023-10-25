import { connect } from "mongoose";

const connectDb = () => {
    return connect(process.env.MONGODB_URI);
}

export default connectDb;