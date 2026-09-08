import {body} from 'express-validator';
export const registerValidator = [
    body("username")
    .trim()
    .notEmpty()
    .withMessage("usernameRequired")
    .isLength({ min: 3 })
    .withMessage("usernameMinLength"),




    body("email")
    .trim()
    .notEmpty()
    .withMessage("emailRequired")
     .custom((value)=>{
        if (!value.includes("@")) {
            throw new Error("emailMustContainAt")
        }
        if (!value.includes(".")) {
            throw new Error("emailMustContainAtSecond") 
        }
        return true
     })

    .isEmail()
   .withMessage("invalidEmail"),



body("phoneNumber")
.notEmpty()
.withMessage("phoneNumberRequired")
.matches(/^\+[1-9]\d{7,14}$/)
.withMessage("invalidPhoneNumber"),


     body("password")
    .notEmpty()
    .withMessage("passwordRequired")
    .isLength({ min: 8 })
    .withMessage("passwordMinLength")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage("passwordWeak"),
    






    body("gender")
       .notEmpty()
        .withMessage("genderRequired")
        .isIn(["male", "female"])
        .withMessage("invalidGender"),

    body("birthDate")
    .notEmpty()
    .withMessage("birthDateRequired")    
]

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("emailRequired"),

    body("password")
        .notEmpty()
        .withMessage("passwordRequired")
];