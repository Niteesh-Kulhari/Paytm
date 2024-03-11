const express = require('express');
const {Account} = require("../db");
const { authmiddleware } = require('../middleware');
const { default: mongoose } = require('mongoose');
const router = express.Router()


router.get("/balance", authmiddleware, async(req,res)=>{
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    });
});


// Solution to transfer without Transactions
// router.post("/transfer",authmiddleware, async (req,res)=>{
//     const {amount, to} = req.body;

//     const account = Account.findOne({
//         userId: req.userId
//     });

//     if(account.balance < amount){
//         return res.status(400).json({
//             message: "Insufficient balance in your account"
//         })
//     }

//     const toAccount = Account.findOne({
//         userId: to
//     });

//     if(!toAccount){
//         res.status(400).json({
//             message: "Invalid Acoount"
//         })
//     }

//     await Account.updateOne({
//         userId: req.userId
//     },{
//         $inc: {
//             balance: -amount
//         }
//     })

//     await Account.updateOne({
//         userId: to
//     },{
//         $inc: {
//             balance: amount
//         }
//     })

//     res.json({
//         message: "Transfer Successful"
//     });
// })


router.post("/transfer", authmiddleware, async (req, res)=>{
    const session = await mongoose.startSession();

    session.startTransaction();

    const{amount, to} = req.body;

    const account = await Account.findOne({userId: req.userId}).session(session);

    if(account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    const toAccount = await Account.findOne({userId: to}).session(session)

    if(!toAccount){
        await session.abortTransaction();
        res.status(400).json({
            message: "No Acoount found"
        });
    }

    await Account.updateOne({userId: req.userId},{$inc:{balance: -amount}}).session(session)
    await Account.updateOne({userId: to}, {$inc: {balance: amount}}).session(session)

    await session.commitTransaction();
    res.json({
        message: "Transfer Successful"
    });
});

module.exports = router