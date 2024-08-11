const express = require('express');
const path = require('path');


const router = express.Router();

router
    .route('/')
    .get( async (req, res) => {
        console.log("home page requested");
        const isLoggedIn = req.cookies.isLoggedIn;
        console.log("isLoggedIn: ", isLoggedIn);

        if( isLoggedIn == undefined || isLoggedIn == "false" ){
            console.log("user is not logged in");
            res.render('../views/logIn',{authorized: "false"});
        }
        else if (isLoggedIn == "true"){
            console.log("user is already logged in");
            res.sendFile(path.join(__dirname, '..','..','public/map1.html'));
        }
    })

module.exports = router;