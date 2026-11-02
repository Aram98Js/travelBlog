import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const GoogleAuthButton = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credential: string) => {
    try {
      const response = await fetch(
        "http://localhost:3000/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.msg);
        return;
      }

      if (!data.accessToken || !data.user?._id) {
        console.error("Token or user ID missing");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      
localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userLogin"));

      navigate(`/profile/${data.user._id}`);
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={(response) => {
        if (response.credential) {
          void handleSuccess(response.credential);
        }
      }}
      onError={() => {
        console.error("Google Authentication failed");
      }}
    />
  );
};

export default GoogleAuthButton;