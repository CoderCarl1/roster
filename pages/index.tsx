import { useState, useEffect } from "react";
import type { Tperson, } from "../types";
import Timetable from "../components/Timetable";

export default function Home() {
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

  return (
    <div>
      <h1>Appointments</h1>
      <Timetable customers={customers} date={new Date()}/>
    </div>
  );
}