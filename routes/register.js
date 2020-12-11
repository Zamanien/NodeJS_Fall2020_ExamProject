const router = require('express').Router(); 
const bcrypt = require('bcrypt');

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
        res.status(201).send();
    } catch {   
        res.status(501).send();
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