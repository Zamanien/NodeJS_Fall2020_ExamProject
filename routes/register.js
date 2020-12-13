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

/*pool.query('SELECT * FROM users', (err, result, fields) => {
    if(err){
        console.log(err);
    }else{
        console.log(result);
    }
});
*/

const tempUsers = []

router.get('/users', (req, res) => {
    return res.json(tempUsers); 
});

//Post route - reads register form data & encrypts password 
router.post('/register', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //const user = {username: req.body.username, password: hashedPassword, email: req.body.email};
        //tempUsers.push(user);
        await pool.execute("INSERT INTO users SET username = ?, password = ?, email = ?", [req.body.username, hashedPassword, req.body.email]);
        return res.redirect('/login')  
    } catch(error) {   
        res.status(501).send('Error register');
    }
    
});
//TODO: 
//Split into own file
router.post('/login', async (req, res) => {
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


module.exports = router; 