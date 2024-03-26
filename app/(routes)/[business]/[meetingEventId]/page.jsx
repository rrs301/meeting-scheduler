"use client"
import React, { useEffect, useState } from 'react'
import MeetingTimeDateSelection from '../_components/MeetingTimeDateSelection'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { app } from '@/config/FirebaseConfig';

function SharedMeetingEvent({params}) {
    const db=getFirestore(app);
    const [businessInfo,setBusinesInfo]=useState();
    const [eventInfo,setEventInfo]=useState();
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
        params&&getMeetingBusinessAndEventDetails();
    },[params])

    /**
     * Used to get Business Info and Event Details for Give Login User/Business Owner
     */
    const getMeetingBusinessAndEventDetails=async()=>{
        setLoading(true)
        const q=query(collection(db,'Business'),where('businessName','==',params.business));
        const docSnap=await getDocs(q);
        docSnap.forEach((doc)=>{
            setBusinesInfo(doc.data())
        });
       
        const docRef=doc(db,'MeetingEvent',params?.meetingEventId);
        const result=await getDoc(docRef);
        setEventInfo(result.data());

        setLoading(false)

    }

  return (
    <div>
        <MeetingTimeDateSelection eventInfo={eventInfo}
        businessInfo={businessInfo} />
    </div>
  )
}

export default SharedMeetingEvent