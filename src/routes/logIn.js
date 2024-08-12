const express = require('express');
const jwt = require('jsonwebtoken');
const { 
    authUser,
    emailExists,
    signUpUser
} = require('../api/logInApi.js');

const router = express.Router();



router
    .route('/')

    .get( async(req,res) =>
    {
        // here we will render login.ejs page
        res.render('../views/logIn');
    })

    .post( async ( req, res ) => 
    {
        // here we will take login data from user and check if it is valid or not
        // if valid then redirect to home page
        // else show error message
        try{
            const {
                email,
                password
            } = req.body;

            console.log(email);
            console.log(password);

            const bool = await authUser( email, password );         // checks if user is valid or not

            if( bool == true ){

                const payLoad = {
                    email: email,
                    password: password,
                }

                const accessToken = jwt.sign( payLoad, process.env.ACCESS_TOKEN_SECRET );    
                res.cookie('token', accessToken, { httpOnly: true , secure: false });
                res.cookie('isLoggedIn',true, { httpOnly: false , secure: false });
                res.status(200).json({ message: 'User Logged In' });
            }
            else{
                res.status(403).json(  { message: 'Invalid Email or Password' } );
            }
        }catch(err){
            console.log(err);
        }
    })

router
    .route('/signup')
    .post( async ( req, res ) => 
    {
        // here we will take login data from user and check if it is valid or not
        // if valid then redirect to home page
        // else show error message
        try{
            const {
                name,
                email,
                phone,
                password
            } = req.body;

            const emailExistsStatus = await emailExists( email );
            console.log(emailExistsStatus);

            if( emailExistsStatus == false ){
                const flag = await signUpUser( name, email, phone, password );
                if( flag == true ){
                    res.status(200).json( { message: 'User Signed Up' } );
                    console.log("User Signed Up");
                }
                else{
                    res.status(400).json( { message: 'error occurred, couldnot sign up' } );
                    console.log("error occurred, couldnot sign up");
                }
            } 
            else{
                res.status(403).json( { message: 'Email already exists' } );
                console.log("Email already exists");
            }
        }catch(err){
            console.log(err);
        }
    })

module.exports = router;