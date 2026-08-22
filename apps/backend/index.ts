import express from "express";
import { prisma } from "./db";

const app = express();

app.use(express.json());

app.post("/signup" , async (req , res ) => {
    const {username , email , password } = req.body;
    await prisma.user.create({
        data : {
            username,
            email,
            password
        }
    })
    res.json({
        message : "user is signed in"
    })
})

app.listen(4000);