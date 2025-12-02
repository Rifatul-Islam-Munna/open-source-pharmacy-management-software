"use server"

import { LoginResponse } from "@/@types/user";
import { PostRequestAxios } from "@/api-hooks/api-hook";
import { cookies } from "next/headers";

export const loginUser = async (email:string,password:string)=>{


    const payload ={email,password}
    const [data,error] = await PostRequestAxios<LoginResponse>(`/user/signin-user`,payload);
    console.log("data-user-login->",data,"error-user-login->",error);
    
    console.log("data-user-login->",data,"error-user-login->",error);
    if(data?.access_token){
        const userInfo ={
          
            id:data?.user._id,
            email:data?.user.email,
            role:data?.user.type,
            name:data?.user.ownerName ?? data?.user.workerName,
            location:data?.user.location,
            shopName:data?.user.shopName,
            phone:data?.user.mobileNumber,
            slug:data?.user.slug,

        }
     const coookies = await cookies()
      coookies.set("access_token",data?.access_token,{maxAge:60*60*24*10,path:'/'});
      coookies.set("refresh_token",data?.refresh_token,{maxAge:60*60*24*30,path:'/'})
      coookies.set("user_info",JSON.stringify(userInfo),{maxAge:60*60*24*60,path:'/'})
    
    }
 
    return {data,error}
}