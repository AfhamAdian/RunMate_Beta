const jwt = require('jsonwebtoken');
const {getUserIdFromEmail} = require('../api/logInApi.js');


async function getUserIdFromJwt( req ) {
    try{

        if( req.cookies.token == undefined ){
            return null;
        }
        const payload = await jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET);
        const user_id  = await getUserIdFromEmail(payload.email);
        return user_id;
    }catch(err){
        console.log(err);
        return null;
    }
}


module.exports = {getUserIdFromJwt};
