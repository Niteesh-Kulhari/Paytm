const express = require("express");
const z = require("zod");
const {JWT_SECRET} = require("../config");
const {User, Account} = require("../db")
const router = express.Router()
const jwt = require('jsonwebtoken');
const {authmiddleware} = require('../middleware')

const signupBody = z.object({
    username: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
});

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    //console.log(success);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Invalid Inputs"
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.status(411).json({
            message: "Email is already taken/ Invalid Inputs"
        });
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName, // Corrected: firstName instead of firstname
        lastName: req.body.lastName    // Corrected: lastName instead of lastname
    });

    const userId = user._id;

    // Assuming Account is imported and exists in your code
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User Created Successfully",
        token: token
    });
});

const signinbody = z.object({
    username: z.string().email(),
    password: z.string()
});

router.post("/signin", async (req,res)=>{
    const {success} = signinbody.safeParse(req.body);

    if(!success){
        res.status(411).json({
            message: "Error while logging in"
        })
    }

    const user  = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(!user){
        res.status(411).json({
            message: "No user Found"
        })
    }

    const token = jwt.sign({
        userId: user._id
    },JWT_SECRET)

    res.json({
        token: token
    })
})

const updateSchema = z.object({
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
})

router.put("/" , authmiddleware, async (req,res)=>{
    const {success} = updateSchema.safeParse(req.body);

    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({
        id: req.userId
    }, req.body)

    res.json({
        message: "Updated Successfully"
    })
})


router.get("/bulk", async (req,res)=>{
    const filter = req.query.filter || ""

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        },{
            lastName: {
                "$regex": filter
            }
        }]
    });

    res.json({
        user: users.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;