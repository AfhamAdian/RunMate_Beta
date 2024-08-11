const pool = require('../db/db');



async function authUser( email, password )
{
    try{
        const query = `SELECT * FROM users WHERE user_email = $1 AND user_password = $2`;
        const values = [email, password];

        const result = await pool.query(query, values);
        if( result.rows.length == 0 ){
            return false;
        }
        else{
            return true;
        }
    }catch(err){
        console.log(err);
    }
}


module.exports = {
    authUser 
};