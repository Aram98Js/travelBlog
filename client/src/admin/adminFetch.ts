import type { NavigateFunction } from "react-router-dom";
const adminFetch = async(
    url:string,
    navigate: NavigateFunction,
    option: RequestInit ={}
)=>{
    const token = localStorage.getItem("data_token");
    const response = await fetch(url,{
      
        headers:{
            "Content-Type": "application/json",
            ...option.headers,
            Authorization: `Bearer ${token}`
        }
    });
  if (response.status === 401) {
    
    localStorage.removeItem("data_token");

    navigate("/admin/login");
    return null

  }
  return response
}

export default adminFetch