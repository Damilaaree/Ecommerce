const {check} = require('express-validator');
const userRepo = require('../../repositories/user')

module.exports = {
requireTitle:check('title')    
.trim()
.isLength({min: 5, max: 40})
.withMessage('must be between 5 and 40 character'),
requirePrice:check('price')
.trim()
.toFloat()
.isFloat({min: 1})
.withMessage('must be a number greater than one'),

requireEmail:check('email')
.trim()
.normalizeEmail()
.isEmail()
.withMessage('Must be a valid Email')
.custom(async email => {
const existingUser = await  userRepo.getOneBy({email});
if(existingUser){
   throw new Error('Email in use');
}
}),  


requirePassword: check('password')
.trim().
isLength({min:4, max:20}).
withMessage('Must be bewteen 4 and 20 characters'),

requirePasswordConfirmation: check('passwordConfirmation').
trim().
isLength({min: 4, max: 20}).
withMessage('Must be bewteen 4 and 20 characters')
.custom((passwordConfirmation, {req})=>{
    if(passwordConfirmation !== req.body.password){
        throw new Error('password must match');
    }
}),

requireEmailExists: check('email')
.trim()
.normalizeEmail()
.isEmail()
.withMessage('Email not found')
.custom(async email => {
const user = await userRepo.getOneBy({email});
if(!user){
    throw new Error("Email not found!");
}
}),

requireValidPasswordForUser: check('password')
.trim()
.custom(async (password, {req})  => {
    const user = await userRepo.getOneBy({email: req.body.email});
    if(!user){
        throw new Error('Invalid password');
    }
    const validPassword = await userRepo.comparePasswords(
        user.password,
        password
        );
        
        if(!validPassword){
           throw new Error('Invalid password');
        }
    }),



};