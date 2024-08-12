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

async function emailExists( email )
{
    try{
        const query = `SELECT * FROM users WHERE user_email = $1`;
        const values = [email];

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


async function signUpUser( name, email, phone, password ){
    try{
        const query = 'SELECT insert_user($1, $2, $3, $4) AS RESULT';
        const values = [name,email,password,phone];

        const result = await pool.query(query, values);
        console.log(result.rows[0].result);

        if( result.rows[0].result == 1 ){
            return true;
        }
        else{
            return false;
        }

    }catch(err){
        console.log(err);
        return false;
    }
}


async function getUserIdFromEmail ( email )
{
    try{
        const query = `SELECT user_id FROM users WHERE user_email = '${email}'`;
        const values = [];
        
        const result = await pool.query(query, values);
        return result.rows[0].user_id;
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    authUser,
    emailExists,
    signUpUser,
    getUserIdFromEmail
};