import React from 'react'
import { useRef } from 'react'
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import zod from 'zod'
const Signup = () => {
    const input1 = useRef<HTMLInputElement>(null);
    const input2 = useRef<HTMLInputElement>(null);
    const input3 = useRef<HTMLInputElement>(null);
    const input4 = useRef<HTMLInputElement>(null);
  const [error, seterror] = useState<any>({});
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const signupSchema = zod.object({
     firstname: zod.string().min(3, "First name should be atleast three characters"),
    lastname: zod.string().min(3, "Last name should be atleast three characters"),
    username: zod.string().email().min(6, "email should be atleast six characters"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
  })
const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (
        !input1.current?.value ||
        !input2.current?.value ||
        !input3.current?.value ||
        !input4.current?.value
    ) {
        return;
    }
       const firstname = input1.current?.value;
       const lastname = input2.current?.value;
       const  username = input3.current?.value;
      const password =  input4.current?.value;
      const parsedata = signupSchema.safeParse({firstname,lastname,username,password});
      if(!parsedata.success)
      {
        const errorMessage:any = {};
console.log(parsedata.error.errors);
console.log(parsedata.error);
parsedata.error.errors.forEach((err)=>{
errorMessage[err.path[0]] = err;
})
seterror(errorMessage);
return;
      }
    setloading(true);
    fetch("https://paytm-backend-tan.vercel.app/api/v1/user/signup", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstname,
            lastname,
            username,
            password
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                setloading(false);
              toast.success("signup successully");
                if (input1.current) input1.current.value = '';
                if (input2.current) input2.current.value = '';
                if (input3.current) input3.current.value = '';
                if (input4.current) input4.current.value = '';
                navigate("/signin");
                seterror({});
            }
            else{
            setloading(false);
            console.log(data.error);
              seterror({});
            }
        })
        .catch(err => {
            setloading(false);
             console.log(err);
                seterror({});
        });
}
  return (
    <div className='h-screen w-screen bg-black items-end flex justify-center '>
      <div style={{
  gap:Object.keys(error).length > 0 ? "8px" :"20px"
}} className='h-[92%] md:w-1/3 w-4/5  border bg-white  py-4 flex flex-col  px-4 rounded-md'>
      <div className=' flex flex-col '>
 <h1 className='w-full flex font-bold text-3xl justify-center'>Sign Up</h1>
      <p className='flex px-7 text-center text-gray-500 justify-center items-center  font-bold'>Enter your information to create an account</p>
      </div>
<div style={{
  gap:Object.keys(error).length > 0 ? "2px" :"15px"
}} className='flex flex-col w-[100%] '>
          <label className='font-bold ' htmlFor="input1"> <span className='my-2'>First Name</span>
<input style={{marginBottom:error.firstname ? "0px" : "12px"}} type="text" ref={input1} id='input1' placeholder='John' className='border block mx-auto  w-[95%] rounded-md p-2'/></label>
<p style={{
  display:error.firstname ? "block" : "none"
}} className='text-red-900  text-center'>{error.firstname && error.firstname.message}</p>
 <label className='font-bold' htmlFor="input2"> Last Name
<input style={{marginBottom:error.lastname ? "0px" : "12px"}} type="text" ref={input2}  id='input2' placeholder='Doe' className='border mx-auto block w-[95%] rounded-md p-2'/></label>
<p style={{
  display:error.lastname ? "block" : "none"
}} className='text-red-900  text-center'>{error.lastname && error.lastname.message}</p>

      <label className='font-bold' htmlFor="input3"> Email

<input style={{marginBottom:error.username ? "0px" : "12px"}} type="email" ref={input3}  id='input3' placeholder='username@gmail.com' className='border block w-[95%] mx-auto  rounded-md p-2'/></label>
<p style={{
  display:error.username ? "block" : "none"
}} className='text-red-900  text-center'>{error.username && error.username.message}</p>


      <label className='font-bold' htmlFor="input4"> Password
<input style={{marginBottom:error.password ? "0px" : "12px"}} type="password" ref={input4}  id='input4' placeholder='example123' className='border mx-auto  w-[95%] block rounded-md p-2'/></label>
<p style={{
  display:error.password  ? "block" : "none"
}} className='text-red-900  text-center'>{error.password && error.password.message}</p>
<input style={{marginTop:"10px"}} onClick={handleSubmit} type="submit" value={loading ? 'Signing Up...':'Sign Up'} className='border  bg-black text-white font-bold cursor-pointer mx-auto  w-[95%] block rounded-md p-2'/>

</div>
      </div>
    </div>
  )
}

export default Signup
