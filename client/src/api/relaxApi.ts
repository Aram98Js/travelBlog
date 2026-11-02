import { RelaxRoute } from "../enums/relaxAiRoute";


export const getNatureAdvice = async(message:string)=>{
    try {
       const response = await fetch(`http://localhost:3000${RelaxRoute.NATURE}`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            message
         })
        
       })
       const data = await response.json();
      return data
       
    } catch (error) {
      console.log(error);
        
    }
}

export const getWeekendAdvice = async(message:string)=>{
    try {
       const response = await fetch(`http://localhost:3000${RelaxRoute.WEEKEND}`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            message
         })
       })
       const data = await response.json();
     return data
       
    } catch (error) {
      console.log(error);
        
    }
}
export const getSpaAdvice = async(message:string)=>{
    try {
       const response = await fetch(`http://localhost:3000${RelaxRoute.SPA}`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            message
         })
       })
       const data = await response.json();
  return data
    } catch (error) {
      console.log(error);
        
    }
}
export const getFamilyAdvice = async(message:string)=>{
    try {
       const response = await fetch(`http://localhost:3000${RelaxRoute.FAMILY}`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            message
         })
       })
       const data = await response.json();
      return data
       
    } catch (error) {
      console.log(error);
        
    }
}