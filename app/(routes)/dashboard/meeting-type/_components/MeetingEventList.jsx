"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { app } from '@/config/FirebaseConfig'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { getFirestore, collection, query, where, getDocs, orderBy, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { Clock, Copy, MapPin, Pen, Settings, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
function MeetingEventList() {
    const db = getFirestore(app);
    const { user } = useKindeBrowserClient();
    const [businessInfo,setBusinessInfo]=useState();
    const [eventList,setEventList]=useState([]);
        useEffect(() => {
            user && getEventList();
            user&& BusinessInfo();
        }, [user])
    const getEventList = async () => {
        setEventList([]);
        const q = query(collection(db, "MeetingEvent"),
            where("createdBy", "==", user?.email),
            orderBy('id','desc'));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            setEventList(prevEvent=>[...prevEvent,doc.data()])
        });
    }

    const BusinessInfo=async()=>{
        const docRef=doc(db,'Business',user.email);
        const docSnap=await getDoc(docRef);
        setBusinessInfo(docSnap.data());
    }

    const onDeleteMeetingEvent=async(event)=>{
      await deleteDoc(doc(db, "MeetingEvent", event?.id)).then(resp=>{
        toast('Meeting Event Deleted!');
        getEventList();
      })
    }

    const onCopyClickHandler=(event)=>{
        const meetingEventUrl=process.env.NEXT_PUBLIC_BASE_URL+'/'+businessInfo.businessName+'/'+event.id
        navigator.clipboard.writeText(meetingEventUrl);
        toast('Copied to Clicpboard')
    }
    return (
        <div className='mt-10 grid grid-cols-1 md:grid-cols-2 
        lg:grid-cols-3 gap-7'>
            {eventList.length>0?eventList?.map((event,index)=>(
                <div className='border shadow-md 
                border-t-8 rounded-lg p-5 flex flex-col gap-3'
                style={{borderTopColor:event?.themeColor}}
                >
                    <div className='flex justify-end'>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Settings className='cursor-pointer'/>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          
                            <DropdownMenuItem className="flex gap-2"> <Pen/> Edit</DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2"
                            onClick={()=>onDeleteMeetingEvent(event)}
                            > <Trash/> Delete</DropdownMenuItem>
                         
                        </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                    <h2 className="font-medium text-xl">
                        {event?.eventName}</h2>
                    <div className='flex justify-between'>
                    <h2 className='flex gap-2 text-gray-500'><Clock/> {event.duration} Min </h2>
                    <h2 className='flex gap-2 text-gray-500'><MapPin/> {event.locationType} Min </h2>
                    
                    </div>
                    <hr></hr>
                    <div className='flex justify-between'>
                    <h2 className='flex gap-2 text-sm text-primary 
                    items-center cursor-pointer'
                    onClick={()=>{
                        onCopyClickHandler(event)
                       
                    }}
                    >
                        <Copy className='h-4 w-4'/> Copy Link </h2>
                    <Button variant="outline" 
                    className="rounded-full text-primary border-primary ">Share</Button>
                    </div>
                </div>
            ))
                :<h2>Loading...</h2>
        }
        </div>
    )
}

export default MeetingEventList