    import { Fragment, useEffect, useRef, useState } from "react";
import "./VerifyPhone.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const VerifyPhone = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState("");
  const {t} = useTranslation()
const email = location.state?.email
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);


  const handleChange = (
    value: string,
    index: number
  ) => {
   
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

   
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };


  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify
  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

   try {
    const response = await fetch("http://localhost:3000/auth/verify-email",{
     method:"POST",
     headers:{
      "Content-Type": "application/json",
     },
     body: JSON.stringify({ 
       otp: code, 
       email: email
      })
    })
    const data = await response.json();
    if (!response.ok) { 
      setError(data.msg || "Invalid or expired OTP");
       return; 
      } 
      console.log("VERIFY RESPONSE:", data); 
      navigate("/login");
   } catch (error) {
    console.log("VERIFY ERROR:", error); 
    setError("Something went wrong. Please try again.");
   }
  };


  const handleResend =async () => {
   
    if (timeLeft > 0) return;

    setOtp(["", "", "", "", "", ""]);
    setError("");
    setTimeLeft(60);

    inputRefs.current[0]?.focus();

 try {
  const response = await fetch("http://localhost:3000/auth/resend-email-otp",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      email
 
    })
  })
  const data = await response.json();
 if (!response.ok) { 
  setError(data.msg || "Failed to resend OTP"); 
  return; 
} console.log("RESEND RESPONSE:", data);
  
 } catch (error) {
 console.log("RESEND ERROR:", error); setError("Something went wrong. Please try again.");
  
 }

    console.log("Resend OTP");
  };

  return (
<Fragment>
<Helmet>
  <title>{t("pagesTitle.verifyPage")}</title>

  <meta
    name="description"
    content={t("pagesDescription.verifyPage")}
  />

  <meta
    name="keywords"
    content={t("pagesKeywords.verifyPage")}
  />

  <meta
    property="og:title"
    content={t("pagesTitle.verifyPage")}
  />

  <meta
    property="og:description"
    content={t("pagesDescription.verifyPage")}
  />

  <meta
    property="og:type"
    content="website"
  />
</Helmet>
<div className="verify-phone">
      <div className="verify-phone__card">

        <div className="verify-phone__icon">
          📱
        </div>

        <h1>{t("verification.verifyPhone")}</h1>

        <p className="verify-phone__description">
          {t("verification.sendVerificationCode")}
        </p>

        <p className="verify-phone__number">
          +374 77 123456
        </p>

        <div className="verify-phone__inputs">
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
            />
          ))}
        </div>

        {error && (
          <p className="verify-phone__error">
            {error}
          </p>
        )}

        <button
          className="verify-phone__button"
          onClick={handleVerify}
        >
         {t("verification.resendCode")}
         
        </button>

        <div className="verify-phone__resend">
          {timeLeft > 0 ? (
            <p>
            {t("verification.resendCode")}{" "}
              <span>{timeLeft}{t("verification.second")}</span>
            </p>
          ) : (
            <button onClick={handleResend}>
             {t("verification.ResendCodeTwo")}
            </button>
          )}
        </div>

      </div>
    </div>
</Fragment>

    
  );
};

export default VerifyPhone;