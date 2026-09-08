import React, { Fragment, useState, } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, EyeClosed } from 'lucide-react'
import './UserRegister.scss'
import { Helmet } from 'react-helmet-async'
import Button from '../Components/Button'
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import emailjs from "@emailjs/browser";
import { Country, City } from "country-state-city";
type RegisterFormData = {
    username: string,
    email: string,
    phoneNumber: string
    password: string,
    country:string,
    city:string,
   gender:string,
   birthDate:{
    day: number | "",
    month: string 
    year:number | ""
   }
}

const Register = () => {
  const {t} = useTranslation()
    const navigate = useNavigate();
    const[togglePassword,setTogglePassword] = useState<boolean>(false)
    const [image,setImage] = useState<File | null>(null)
  
const [formData,setFormData] = useState<RegisterFormData>({
      username: "",
      email: "",
      phoneNumber:"",
      password: "",
      gender:"",
      country:"",
      city:"",
      birthDate:{
      day:"",
      month:"",
      year:""
     }
})

const [errors,setErrors] = useState<{
  username:string,
  email:string,
  phoneNumber:string,
  password:string,
  gender:string,
city: string,
country: string
  birthDate:{
    day: string,
    month: string 
    year:string
  }
}>({
    username:"",
  email:"",
  phoneNumber:"",
  password:"",
  gender:"",
  city:"",
  country:"",
  birthDate:{
    day: "",
    month:"" ,
    year:""
  }
})
const handleSumbit = async (evt:React.FormEvent<HTMLFormElement>)=>{
  evt.preventDefault()
 const newErrors = {
    username:"",
  email:"",
  password:"",
  phoneNumber:"",
  gender:"",
  city:"",
  country:"",
  birthDate:{
    day: "",
    month:"" ,
    year:""
  }
    }

    if(!formData.username){
    newErrors.username = t("validation.usernameRequired")
  } 
  
    if(!formData.email){
    newErrors.email = t("validation.emailRequired")
    
  } 

  if(!formData.phoneNumber){
    newErrors.phoneNumber = t("validation.phoneNumberRequired")
    
  } 

    if(!formData.password){
    newErrors.password = t("validation.passwordRequired")

  } 
    if(!formData.gender){
    newErrors.gender = t("validation.genderRequired")

  } 

if (!formData.birthDate.day) {
    newErrors.birthDate.day = t("validation.dateOfBirth.dayRequired");
}

if (!formData.birthDate.month) {
    newErrors.birthDate.month = t("validation.dateOfBirth.monthRequired");
}

if (!formData.birthDate.year) {
    newErrors.birthDate.year = t("validation.dateOfBirth.yearRequired");
}
if (!formData.country) {
  newErrors.country = "Country is required";
}

if (!formData.city) {
  newErrors.city = "City is required";
}


if (
    newErrors.username ||
    newErrors.email ||
    newErrors.password ||
    newErrors.gender ||
      newErrors.country ||
  newErrors.city ||
    newErrors.birthDate.day ||
    newErrors.birthDate.month ||
    newErrors.birthDate.year
) {
    setErrors(newErrors);
    return;
}

     const dataForm = new FormData();
  dataForm.append("username",formData.username)
  dataForm.append("email",formData.email)
  dataForm.append("phoneNumber",formData.phoneNumber)
  dataForm.append("password",formData.password)
  dataForm.append("gender",formData.gender)
  dataForm.append("country", formData.country);
dataForm.append("city", formData.city);
  dataForm.append("birthDate",JSON.stringify(formData.birthDate))
  if (image) {
    dataForm.append("image",image)
  }
  const response = await fetch("http://localhost:3000/userRegister",{
        method:"POST",
        body:dataForm,
      
    })
    const data = await response.json();
console.log("LOGIN ERROR DATA:", data);
    
      console.log(data);

      if (!response.ok) {
        setErrors(prev=>({
          ...prev,
          [data.path]: t(`validation.${data.msg}`)
        }));
        return
      }




if (!data.createdUser?.emailOtp) {
  console.log("OTP IS MISSING:", data);

  setErrors(prev => ({
    ...prev,
    email: "Verification code was not generated"
  }));

  return;
}
      
    const otp = data?.createdUser?.emailOtp;


  const emailResult =  await emailjs.send(
      import.meta.env.VITE_VERIFY_SERVICE_ID,
        import.meta.env.VITE_VERIFY_TEMPLATE_ID,
        {
          email: formData.email,
          username: formData.username,
          passcode: otp,
          time: "5 minutes"
        },
         {
          publicKey:import.meta.env.VITE_VERIFY_EMAIL_PUBLIC_KEY
        }
    )

    console.log("EMAILJS RESULT:", emailResult);
      navigate("/otpVerify",{
         state: {
          email: formData.email
        }
      }) 
   
}

   const handleImageChange = (
      evt: React.ChangeEvent<HTMLInputElement>
  )=>{
  
      if(evt.target.files){
  
          setImage(evt.target.files[0]);
  
      }
  
  }


const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)=>{
      setFormData({
        ...formData,
        [evt.target.name]: evt.target.value
    });
    setErrors(prev => ({
    ...prev,
    [evt.target.name]: ""
}));
}
const handleBirthChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
const {name,value} = evt.target;
setFormData((prev)=>({
  ...prev,
  birthDate:{
    ...prev.birthDate,
    [name]: value
  }
}))

setErrors(prev => ({
    ...prev,
    birthDate:{
      ...prev.birthDate,
      [name]: ""
    }
}));  
}
const handleChangeGender = (evt: React.ChangeEvent<HTMLSelectElement>)=>{
  setFormData((prev)=>({
    ...prev,
    [evt.target.name]: evt.target.value
  }))
  setErrors(prev=>({
  ...prev,
  gender:""
  }))
}

const countries = Country.getAllCountries().filter(
  (country)=>
country.isoCode !== "AZ" &&
 country.isoCode !== "TR"
)


  return (


<Fragment>
  <Helmet>
  <title>{t("pagesTitle.registerPage")}</title>
  <meta name="description" content="Create your Travel Notes account to explore destinations, save your favorite posts, and enjoy personalized travel experiences."/>
  <meta name="keywords" content="Travel Notes, registration, create account, travel website, travel destinations"/>
  <meta property="og:title" content="Create Account | Travel Notes"/>
  <meta property="og:description" content="Create your Travel Notes account to explore destinations, save your favorite posts, and enjoy personalized travel experiences."/>
  <meta property="og:type" content="website"/>
</Helmet>
<div className="register">
  <div className="register__container">

    <h1 className="register__title">
      {t("register")}
    </h1>

    <form onSubmit={handleSumbit}>

      {/* Username */}
      <div className="input-group">
        <label>{t("username")}</label>

        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder={t("placeHolder.usernameForRegister")}
          onChange={handleChange}
        />
        {errors.username &&(
          <p className='error'>{errors.username}</p>
        )}
      </div>




      {/* Email */}
      <div className="input-group">
        <label>{t("email")}</label>

        <input
          type="text"
          name="email"
          value={formData.email}
          placeholder={t("placeHolder.emailForRegister")}
          onChange={handleChange}
        />
         {errors.email &&(
          <p className='error'>{errors.email}</p>
        )}
      </div>

<div className="input-group">
  <label>Country</label>

  <select
    name="country"
    value={formData.country}
    onChange={(e) => {
      setFormData((prev) => ({
        ...prev,
        country: e.target.value,
        city: "",
      }));
    }}
  >
    <option value="">Select country</option>

    {countries.map((country) => (
      <option
        key={country.isoCode}
        value={country.isoCode}
      >
       {country.name}
      </option>
    ))}
  </select>

  {errors.country && (
    <p className="error">{errors.country}</p>
  )}
</div>
<div className="input-group">
  <label>City</label>

  <select
    name="city"
    value={formData.city}
    onChange={(e) => {
      setFormData((prev) => ({
        ...prev,
        city: e.target.value,
      }));

      setErrors((prev) => ({
        ...prev,
        city: "",
      }));
    }}
    disabled={!formData.country}
  >
    <option value="">Select city</option>

    {formData.country &&
      City.getCitiesOfCountry(formData.country)?.map((city) => (
        <option
          key={city.name}
          value={city.name}
        >
          {city.name}
        </option>
      ))}
  </select>

  {errors.city && (
    <p className="error">{errors.city}</p>
  )}
</div>

    {/*Phone Number*/}

   <div className="input-group">
        <label>{t("phoneNumber")}</label>

    <PhoneInput
    international
    defaultCountry="AM"
    value={formData.phoneNumber}
    onChange={(value) =>
      setFormData((prev) => ({
        ...prev,
        phoneNumber: value || "",
      }))
    }
    placeholder={t("placeHolder.phoneNumberForRegister")}
  />
         {errors.email &&(
          <p className='error'>{errors.phoneNumber}</p>
        )}
      </div>



      {/* Password */}
      <div className="input-group">

        
        

        <label>{t("password")}</label>
        <div className="inputBox">
    
        
        <input
        id='passwordField'
          type={togglePassword ? "text" : "password"}
          name="password"
          value={formData.password}
          placeholder={t("placeHolder.passwordForRegister")}
          onChange={handleChange}
        />
          <Button type='button' className="passwordTypeBtn" onClick={() => setTogglePassword(!togglePassword)}>
          {togglePassword ? <Eye /> : <EyeClosed />}
        </Button>
        </div>

         {errors.password &&(
          <p className='error'>{errors.password}</p>
        )}
      </div>

      {/* Gender */}
      <div className="input-group gender-group">
        <label>{t("genderLabel")}</label>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChangeGender}
        >
          <option value="">
            {t("gender.first")}
          </option>

          <option value="male">
            {t("gender.male")}
          </option>

          <option value="female">
            {t("gender.female")}
          </option>

          
        </select>
          {errors.gender &&(
          <p className='error'>{errors.gender}</p>
        )}
      </div>

      {/* Birth Date */}
      <div className="input-group birth-date-group">
        <label>{t("birthDate")}</label>

        <div className="birth-date-inputs">


         <div>
          <input
            type="number"
            name="day"
            value={formData.birthDate.day}
            onChange={handleBirthChange}
            placeholder={t("day")}
            min="1"
            max="31"
          />
           {errors.birthDate.day &&(
          <p className='error'>{errors.birthDate.day}</p>
        )}
          </div>
         <div>
            <select
            name="month"
            value={formData.birthDate.month}
            onChange={handleBirthChange}
          >
            <option value="">
              {t("months.first")}
            </option>
            <option value="january">{t("months.january")}</option>
            <option value="feburuay">{t("months.february")}</option>
            <option value="march">{t("months.march")}</option>
            <option value="april">{t("months.april")}</option>
            <option value="may">{t("months.may")}</option>
            <option value="june">{t("months.june")}</option>
            <option value="july">{t("months.july")}</option>
            <option value="august">{t("months.august")}</option>
            <option value="september">{t("months.september")}</option>
            <option value="october">{t("months.october")} </option>
            <option value="november">{t("months.november")}</option>
            <option value="december">{t("months.december")}</option>

            {/* Months */}
          </select>
   {errors.birthDate.month &&(
          <p className='error'>{errors.birthDate.month}</p>
        )}

         </div>
         <div>

    <input
            type="number"
            name="year"
            value={formData.birthDate.year}
            onChange={handleBirthChange}
            placeholder={t("year")}
            min="1900"
            max={new Date().getFullYear()}
          />
             {errors.birthDate.year &&(
          <p className='error'>{errors.birthDate.year}</p>
        )}
         </div>
        </div>
      </div>
         <div className="form-group">
               <label>Upload Image</label>
               <input type="file" onChange={handleImageChange}/>
             </div>
      <button type="submit">
        {t("register")}
      </button>

    </form>

    <p>{t("HaveAccountText")} <Link to="/login">{t("loginLink")}</Link></p>
  </div>
</div>
</Fragment>
     
  )
}

export default Register