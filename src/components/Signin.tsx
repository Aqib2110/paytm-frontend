import { useRef,useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import zod from 'zod'
const Signin = () => {
  const input1 = useRef<HTMLInputElement>(null);
  const input2 = useRef<HTMLInputElement>(null);
  const [error, seterror] = useState<any>({});
  const [loading, setloading] = useState(false);
const navigate = useNavigate();
const signinSchema = zod.object({
    username: zod.string().email().min(6, "email should be atleast six characters"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
})
const handleSignin = ()=>{
  const username = input1.current?.value;
  const password = input2.current?.value;
 const parsedData = signinSchema.safeParse({
  username,
  password
 });
 if(!parsedData.success)
 {
const messages:any = {};
parsedData.error.errors.forEach((err)=>{
messages[err.path[0]] = err;
})
seterror(messages);
return;
 }
     setloading(true);
  fetch("https://paytm-frontend-cyan.vercel.app/api/v1/user/signin", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
    body:JSON.stringify({username:username,password:password})
  }).then(res=>res.json())
  .then(data=>{
    if(data.token)
    {
      seterror({});
      setloading(false);

localStorage.setItem("token",data.token);
if(input1.current?.value && input2.current?.value)
{
 input1.current.value = '';
input2.current.value = '';
}
toast.success("signin successfully");
navigate("/");
    }
    else if(data.invalid)
    {
         seterror({});
      setloading(false);
toast.success("invalid credentials");
    }
    else if(data.error)
    {
  seterror({});
    setloading(false);
    toast.success("error while signing up");
    }
  }).catch(err=>{
    console.log(err);
    seterror({});
    setloading(false);
  })
}

  return (
    <div className='h-screen w-screen bg-black items-end flex justify-center '>
      <div style={{
        gap:Object.keys(error) ?  "30px" : "56px"
      }} className='h-[83%] md:w-1/3 w-4/5 border bg-white mb-6  py-4 flex flex-col  px-4 rounded-md'>
      <div className=' flex flex-col gap-1'>
 <h1 className='w-full flex font-bold mt-2 text-3xl justify-center'>Sign In</h1>
      <p className='flex px-7 text-center text-gray-500 justify-center items-center  font-bold'>Enter your credentials to access your account</p>
      </div>   
<div className='flex flex-col  w-[100%] gap-3 '>
      <label className='font-bold' htmlFor="input3"> Email
<input ref={input1} type="email"  id='input3' placeholder='username@gmail.com' className='border block w-[95%] mx-auto mt-4  rounded-md p-2'/></label>
<p className='text-red-600 text-center'>{error.username && error.username.message}</p>
      <label className='font-bold' htmlFor="input4"> Password
<input ref={input2} type="password"  id='input4' required placeholder='example123' className='border mx-auto mt-4 w-[95%] block rounded-md p-2'/></label>
<p className='text-red-600 text-center'>{error.password && error.password.message}</p>
<div>
<input  onClick={handleSignin} type="submit" value={loading ? 'Signing In...' : 'Sign In'} className='border bg-black my-3 text-white font-bold cursor-pointer mx-auto  w-[95%] block rounded-md p-2'/>
<p className='text-center '>Don't have an account? <a className='text-blue-900 underline' href="/signup">Sign Up</a></p>
</div>
</div>
      </div>
    </div>
  )
}

export default Signin
