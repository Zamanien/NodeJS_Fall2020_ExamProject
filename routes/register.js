const router = require('express').Router(); 
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 5, 
    queueLimit: 0
});


const tempUsers = []

router.use('/users', (req, res) => {
    return res.json(tempUsers);
});

//Post route - reads register form data & encrypts password 
router.post('/register', async (req, res) => {
    try{
        //Hash password with 10 salt (10 default)
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //assign username, hashed password & email to const user.
        const user = {name: req.body.username, password: hashedPassword, email: req.body.email}
        tempUsers.push(user);
        pool.execute('INSERT INTO users SET username = ?, password = ?, email = ?', [username, hashedPassword, email]);
        return res.redirect('/login')        
    } catch(error) {   
        res.status(501).send(error);
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