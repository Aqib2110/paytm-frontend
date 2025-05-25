import { useRef } from 'react'
import { useState,useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Home = () => {
 interface User{
    _id:string,
    firstname:string,
    lastname:string,
    username:string,
}
const token = localStorage.getItem("token");
const [content, setcontent] = useState('');
const [data, setdata] = useState([]);
const [users, setusers] = useState<User []>([]);
const [user, setuser] = useState({firstname:'',username:''});
const [popup, setpopup] = useState(false);
const [balance, setbalance] = useState(null)
const TimerRef = useRef<any>(null);
const [money, setmoney] = useState(null);
const inputRef = useRef<HTMLInputElement>(null);
const navigate = useNavigate();
useEffect(() => {
if(!token)
{
navigate("/signin");
}
fetch("https://paytm-backend-tan.vercel.app/api/v1/account/balance",{
    headers:{
        'Authorization':"Bearer " + token
    }
})
.then(res=>res.json())
.then(data=>{
    if(data.balance){
setbalance(data.balance);
setuser(data.user);
    }
else if(data.error)
    {
navigate("/signin");
    }
})
const user:any = localStorage.getItem("users");
const users = JSON.parse(user);
console.log(users);
setusers(users || []);
}, [])
useEffect(() => {
 if(users?.length > 0)
{
    localStorage.setItem("users",JSON.stringify(users));
 }
}, [users])

const sendMoney = (id:any)=>{
setpopup(true);
setmoney(id);
}
const handleChange = (e:any)=>{
    const value = e.target.value;
setcontent(value);
if(TimerRef.current)
{
clearTimeout(TimerRef.current);
}

    TimerRef.current = setTimeout(() => {
fetch(`https://paytm-backend-tan.vercel.app/api/v1/user/bulk?filter=${value}`,{
    headers:{
        "Authorization": "Bearer " + token
    }
})
.then(res=>res.json())
.then(datas=>{
setdata(datas.users);
}) 
    }, 300);
}
const handleCross = ()=>{
setpopup(false);
}
const handleSend = ()=>{
    if(!inputRef.current?.value)
    {
        return;
    }
    fetch("https://paytm-backend-tan.vercel.app/api/v1/account/transfer",{
        method:"POST",
        headers:{
            'Content-Type':'application/json',
            'Authorization' : 'Bearer ' + token
        },
        body:JSON.stringify({receiverId:money,amount:inputRef.current.value})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.message)
        {
toast.success(data.message);
setpopup(false);
        }
        else if(data.invalid)
        {
    toast.error(data.invalid);
        }
        else{
    toast.error("Money Transferred Failed"); 
    console.log(data);
        }
    })

}
const handleAdd = (user:any)=>{
setusers(arr=>[...arr,user]);
setcontent('');
}
  return (
    <>
    <div className='h-screen w-screen '>
      <div className='w-full h-[11vh] border-b px-4 py-4 items-center flex justify-between'>
<h1 className='font-bold text-2xl'>Payments App</h1>
<div className='flex justify-center items-center gap-3'>
<h3>Hello, {user?.firstname}</h3>
<span className='bg-gray-300 h-[25px] flex justify-center items-center w-[25px] rounded-3xl'>{user?.username[0]?.toUpperCase()}</span>
</div>
      </div>

<div className='h-[89vh] '>
<h1 className='font-bold block w-full  h-[12vh] px-4 py-5 text-xl'>Your Balance ${balance}</h1>
<div className='h-[77vh] w-full'>
<div className='w-full  h-[16vh] px-4'>
<h1 className='font-bold block w-full text-xl px-4'>Users</h1>
<input value={content} onChange={(e)=>handleChange(e)} type="text" placeholder='Search users...' className='w-full block my-4 rounded-md px-3 py-1  border'/>
</div>

<div className='h-[61vh] flex flex-col gap-4 p-4  overflow-auto'>
    {users?.map((use:User)=>{
        return <div key={use._id} className='flex justify-between  items-center'>
    <div className='flex justify-center items-center gap-3'>
<span className='bg-gray-300 h-[25px] flex justify-center items-center w-[25px] rounded-3xl'>{use.username[0].toUpperCase()}</span>
<h2 className='font-bold'>{use.firstname.toLowerCase()} {use.lastname.toLowerCase()}</h2>
    </div>
<span className='bg-black text-white px-4 py-2 cursor-pointer rounded-md' onClick={()=>{sendMoney(use._id)}}>
Send Money
</span>
     </div>
    })}
  
</div>

<div style={{
    display:content ? "block" : "none"
}} className='p-3 bottom-0  absolute w-[100%] '>
<div className='bg-black h-[61vh] flex flex-col gap-4 p-5 rounded-md overflow-auto'>
{data?.map((user:any)=>{
    return <div key={user._id + Math.random()} className='flex justify-between items-center'>
    <div className='flex justify-center items-center gap-3'>
<span className='bg-gray-300 text-white h-[25px] flex justify-center items-center w-[25px] rounded-3xl'>{user.username[0].toUpperCase()}</span>
<h2 className='font-bold text-white'>{user.firstname.toLowerCase()} {user.lastname.toLowerCase()}</h2>
    </div>
<span className='bg-white text-black px-4 py-2 rounded-md' onClick={()=>{handleAdd(user)}}>
Add
</span>
     </div>
    
})}
</div>
</div>
</div>
</div>
    </div>
    <div style={{
        display:popup ? "flex" : "none"
    }} className='w-screen top-0 opacity-95 flex justify-center items-center bg-white h-screen absolute'>
<div className='md:h-2/5 h-2/6 w-5/7 md:w-2/7 border relative rounded-md px-3'>
<span onClick={handleCross} className='absolute cursor-pointer top-1 right-2'>X</span>
<input ref={inputRef} type="text" className='border block w-full px-2 py-1 mt-15 rounded-md' placeholder='Enter amount...'/>
<span onClick={handleSend} className='block w-full cursor-pointer bg-green-700 text-center mt-8 text-white rounded-md px-2 py-1'>Send</span>
</div>
    </div>
    </>
  )
}

export default Home
