"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient, Call } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "./ui/textarea";
import ReactDatePicker from 'react-datepicker'

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<"isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined>();
  const { user } = useUser();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  });

  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { toast } = useToast()
  const createMeeting = async () => {
    if (!client || !user) return;

    try {

      if(!values.dateTime)
        {
          toast({
            title: "Please select the date and time",
          })
          return;
        }
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to connect call");

      const startAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";
      
      await call.getOrCreate({
        data: {
          starts_at: startAt,
          custom: {
            description: description,
          },
        },
      });

      setCallDetail(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: "Meeting Created",
      })
      
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting",
      })
    }
  };
  const meetingLink = `${process.env.PUBLIC_NEXT_BASE_URL}/meeting/${callDetail?.id}`
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push('/recordings')}
        className="bg-purple-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-1"
      />
      {!callDetail?(
        <MeetingModal 
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Create Meeting"
        handleClick={createMeeting}
      >
        <div className="flex flex-col gap-2.5">
          <label className="text-base text-normal leading-[22px] text-sky-2 ">
            Add a Description
          </label>
          <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" 
          onChange={(e)=>{setValues({...values,description:e.target.value})}}
          />
        </div>
        <div className="flex w-full flex-col gap-2.5">
           <label className="text-base text-normal leading-[22px] text-sky-2 ">
            Select Date and Time
          </label>
          <ReactDatePicker 
          selected={values.dateTime}
          onChange={(date)=>setValues({...values,dateTime:date!})}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
          className="w-full rounded bg-dark-3 p-2 focus:outline-none"
          />
        </div>
      </MeetingModal>
      ):(
        <MeetingModal 
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Meeting Created"
        className="text-center"
        handleClick={()=>{
          // navigator.clipboard.writeText(meetingLink);
          // toast({title:'Link Copied'})
        }}
        image="/icons/checked.svg"
        buttonIcon="/icons/copy.svg"
        buttonText="Copy Meeting Link"
      />
      )}
      <MeetingModal 
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
