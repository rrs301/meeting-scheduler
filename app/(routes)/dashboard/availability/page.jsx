"use client"
import DaysList from '@/app/_utils/DaysList'
import React, { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { collection, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { app } from '@/config/FirebaseConfig'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { toast } from 'sonner'

function Availability() {

    const [daysAvailable,setDaysAvailable]=useState(
        {
        Sunday:false,
        },
        {
            Monday:false
        },
        {
            Tuesday:false
        },
        {
            Wendsday:false
        },
        {
            Thursday:false
        },
        {
            Friday:false
        },
        {
            Saturday:false
        }
    );
    const [startTime,setStartTime]=useState();
    const [endTime,setEndTime]=useState();
    const db=getFirestore(app);
    const {user}=useKindeBrowserClient();

    useEffect(()=>{
        user&&getBusinessInfo();
    },[user])
    const getBusinessInfo=async()=>{
        const docRef=doc(db,'Business',user.email);
        const docSnap=await getDoc(docRef);
        const result=docSnap.data();
        setDaysAvailable(result.daysAvailable);
        setStartTime(result.startTime);
        setEndTime(result.endTime)
    }

    const onHandleChange=(day,value)=>{
        setDaysAvailable({
            ...daysAvailable,
            [day]:value
        })

        console.log(daysAvailable)
    }

    const handleSave=async()=>{
        console.log(daysAvailable,startTime,endTime);
        const docRef=doc(db,'Business',user?.email);
        await updateDoc(docRef,{
            daysAvailable:daysAvailable,
            startTime:startTime,
            endTime:endTime
        }).then(resp=>{
            toast('Change Updated !')
        })
    }

  return (
    <div className='p-10'>
        <h2 className='font-bold text-2xl'>Availability</h2>
        <hr className='my-7'></hr>
        <div>
            <h2 className='font-bold'>Availability Days</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-5 my-3'>
                {DaysList&&DaysList.map((item,index)=>(
                    <div key={index}>
                        <h2><Checkbox
                        checked={daysAvailable&&daysAvailable[item?.day]?daysAvailable[item?.day]:false}
                        onCheckedChange={(e)=>onHandleChange(item.day,e)}
                        /> {item.day}</h2>
                    </div>
                ))}
            </div>
        </div>
        <div>
        <h2 className='font-bold mt-10'>Availability Time</h2>
        <div className='flex gap-10'>
            <div className='mt-3'>
                <h2>Start Time</h2>
                <Input type="time" 
                defaultValue={startTime}
                onChange={(e)=>setStartTime(e.target.value)} />
            </div>
            <div className='mt-3'>
                <h2>End Time</h2>
                <Input type="time" 
                defaultValue={endTime}
                onChange={(e)=>setEndTime(e.target.value)} />
            </div>
        </div>
        </div>
        <Button className="mt-10" 
        onClick={handleSave}
        >Save</Button>
    </div>
  )
}

export default Availability