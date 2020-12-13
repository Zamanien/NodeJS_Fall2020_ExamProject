const router = require('express').Router(); 
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host        : process.env.DB_HOST,
    user        : process.env.DB_USER,
    password    : process.env.DB_SECRET,
    database    : process.env.DB_DBNAME,
    port        : process.env.DB_PORT,
    waitForConnections  : true,
    connectionLimit     : 10,
    queueLimit          : 0
});

//Post route - reads register form data & encrypts password 
router.post('/register', async (req, res) => {
    try{
        //hash the password with bcrypt - 10 saltrounds
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //Insert form data & encrypted password into Database table: users
        await pool.execute("INSERT INTO users SET username = ?, password = ?, email = ?", [req.body.username, hashedPassword, req.body.email]);
        //redirect to loginpage
        return res.redirect('/login')  
    } catch(error) {   
        res.status(501).send(error);
    }
    
});
//TODO: 
//Split into own file
router.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const plainPassword = req.body.password;
        const hashedPassword = await pool.execute("SELECT password FROM users WHERE username = ?", [username]);
        //not defined || empty array
        if(hashedPassword[0][0] === undefined || hashedPassword[0][0].length === 0) {
            res.status(404).send(`User: ${username} not found!`);
        } else if (await bcrypt.compare(plainPassword, hashedPassword[0][0].password)) {
            res.redirect("/index");
        } else {
            res.status(401).send("Wrong password!");
        }
    } catch(err) {
        res.status(500).send(err);
    }
});
/*
    //checks user email from array
    const user = tempUsers.find(user => user.email, req.body.email);
    if(user == null){
        return res.status(400).send('User not found');
    }
    //decrypt and compare password with one from form
    try {
        if (await bcrypt.compare(req.body.password, user.password)){
            res.send('Success');
        } else {
            res.send('Error - Not allowed');
        }
    } catch (error) {
        res.status(500).send();
        
    }
});
*/


module.exports = router; 