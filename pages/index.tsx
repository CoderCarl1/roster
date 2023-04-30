import { useState, useEffect } from "react";
import type { Tperson, } from "../types";
import Timetable from "../components/Timetable";

const useUtils = () => {
  const [customers, setCustomers] = useState<Tperson[]>([]);

  useEffect(() => {
    async function fetchCustomers() {
      const res = await fetch("/api/customers");
      const data = await res.json();
      console.log("data", data)
      setCustomers(data);
    }
    fetchCustomers();
  }, []);

  const today = new Date();
  const week = [];

  // generate array of 7 days starting from today
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    week.push(date);
  }


  return {customers, today, week}
}

export default function Home() {

  const {customers, today, week} = useUtils();

  return (
    <div>
      <h1>Appointments</h1>
      {/* <Timetable customers={customers} date={new Date()}/> */}
      {week.map((date, index) => (
        <div key={index}>
          <h2>{date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</h2>
          <Timetable customers={customers} date={date} />
        </div>
      ))}

    </div>
  );
}