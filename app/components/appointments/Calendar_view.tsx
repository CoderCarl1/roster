// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { Button, DateTimePicker, LoadingComponent } from '@components';
// // import { useCalendarContext } from '~/contexts';
// import { dates, randomHSLValues } from '~/functions';
// import { useAppointments } from '../appointments';
// import {
//     CalendarAppointment,
//     CalendarDayType,
//     CalendarMonthType,
//     CalendarType,
//     CalendarWeekType,
// } from './useCalendar';
// // import { useCalendar } from '.';
// import { shortWeekDay } from '~/functions/helpers/dates';

// // appointment calendar.

// type calendarDisplayTypes = 'day' | 'week' | 'month';
// type mainProps = {
//     displayType: calendarDisplayTypes;
//     setLoading: (
//         value:
//             | boolean
//             | React.SyntheticEvent<Element, Event>
//             | React.MouseEvent<Element, MouseEvent>
//     ) => boolean;
//     loading: boolean;
//     children?: React.ReactNode;
// } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

// export default function Main({
//     displayType,
//     setLoading,
//     loading,
//     children,
//     ...props
// }: mainProps) {
//     const [calendarData, setCalendarData] = useState<CalendarType | null>(null);
//     const {
//         getAppointmentsForDay,
//         getAppointmentsForWeek,
//         getAppointmentsForMonth,
//     } = useAppointments();
//     const { getDay, getWeek, getMonth } = useCalendar();
//     const {
//         currentDate,
//         nextDay,
//         nextWeek,
//         nextMonth,
//         prevDay,
//         prevWeek,
//         prevMonth,
//         setDate,
//     } = useCalendarContext();
//     const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
//         from: '',
//         to: '',
//     });
//     const { from, to } = dateRange;

//     useEffect(() => {
//         const { from, to } = dates.getDateRange(
//             dates.startOfWeek(currentDate.date),
//             6
//         );
//         setDateRange({ from, to });
//     }, [currentDate.date]);

//     useEffect(() => {
//         const setData = {
//             day: () => {
//                 const appointments = getAppointmentsForDay(currentDate.date);
//                 const dayCalendarData = getDay(currentDate.date, appointments);
//                 setCalendarData(dayCalendarData);
//             },
//             week: () => {
//                 const sunday = dates.startOfWeek(currentDate.date);
//                 const appointments = getAppointmentsForWeek(sunday);
//                 const weekCalendarData = getWeek(sunday, appointments);
//                 setCalendarData(weekCalendarData);
//             },
//             month: () => {
//                 const appointments = getAppointmentsForMonth(currentDate.date);
//                 const monthCalendarData = getMonth(
//                     currentDate.date,
//                     appointments
//                 );
//                 setCalendarData(monthCalendarData);
//             },
//         };

//         setData[displayType]();
//         setLoading(false);
//     }, [displayType, currentDate.date]);

//     const handleNext = useCallback(() => {
//         switch (displayType.toLowerCase()) {
//             case 'day':
//                 nextDay();
//                 break;
//             case 'week':
//                 nextWeek();
//                 break;
//             case 'month':
//                 nextMonth();
//                 break;
//             default:
//                 return null;
//         }
//     }, [displayType, nextDay, nextWeek, nextMonth]);

//     const handlePrev = useCallback(() => {
//         switch (displayType.toLowerCase()) {
//             case 'day':
//                 prevDay();
//                 break;
//             case 'week':
//                 prevWeek();
//                 break;
//             case 'month':
//                 prevMonth();
//                 break;
//             default:
//                 return null;
//         }
//     }, [displayType, prevDay, prevWeek, prevMonth]);

//     const dateDisplay = () => {
//         function handleDateDisplayChange(date: Date) {
//             console.log('handleDateDisplayChange');
//             date = dates.parseDate(date);
//             if (displayType === 'week') {
//                 date = dates.startOfWeek(date);
//             }
//             if (displayType === 'month') {
//                 date.setDate(1);
//             }
//             setDate(date);
//         }
//         if (displayType === 'day') {
//             return (
//                 <>
//                     <p>
//                         {currentDate.dayName.slice(0, 3)} {currentDate.day}
//                     </p>
//                     <DateTimePicker
//                         cb={handleDateDisplayChange}
//                         calendartype="day"
//                     />
//                 </>
//             );
//         }
//         if (displayType === 'week') {
//             return (
//                 <>
//                     <p>
//                         {from} - {to}
//                     </p>
//                     <DateTimePicker
//                         cb={handleDateDisplayChange}
//                         calendartype="week"
//                     />
//                 </>
//             );
//         }
//         if (displayType === 'month') {
//             return (
//                 <>
//                     <p>{currentDate.monthName}</p>
//                     <DateTimePicker
//                         cb={handleDateDisplayChange}
//                         calendartype="month"
//                     />
//                 </>
//             );
//         }
//     };

//     return (
//         <section {...props}>
//             <div className="calendar__controls">
//                 <span className="date__information">{dateDisplay()}</span>
//                 <Button onClick={handlePrev}>prev</Button>
//                 <Button onClick={handleNext}>next</Button>
//             </div>
//             <div>{children}</div>

//             {!calendarData || loading ? (
//                 <LoadingComponent />
//             ) : (
//                 (displayType === 'day' && (
//                     <DayCalendar dayData={calendarData as CalendarDayType} />
//                 )) ||
//                 (displayType === 'week' && (
//                     <WeekCalendar weekData={calendarData as CalendarWeekType} />
//                 )) ||
//                 (displayType === 'month' && (
//                     <MonthCalendar
//                         monthData={calendarData as CalendarMonthType}
//                         monthName={currentDate.monthName}
//                     />
//                 ))
//             )}
//         </section>
//     );
// }

// type dayProps = {
//     dayData: CalendarDayType;
//     weekView?: boolean;
// };
// type weekProps = {
//     weekData: CalendarWeekType;
// };

// function DayCalendar({ dayData, weekView = false }: dayProps) {
//     const { data, dayNumber, date, dayName } = dayData;
//     const appointmentSlotLength = appointmentSlotTallies(data);
//     const { setAppointment } = useAppointments();
//     function appointmentSlotTallies(appointmentArray: CalendarAppointment[]) {
//         return appointmentArray.reduce(
//             (obj, b) => {
//                 if (
//                     b.appointment?.id !== null &&
//                     b.appointment?.id !== undefined
//                 ) {
//                     obj[b.appointment.id] = {
//                         initial: (obj[b.appointment.id]?.initial ?? 0) + 1,
//                         available: (obj[b.appointment.id]?.available ?? 0) + 1,
//                     };
//                 }
//                 return obj;
//             },
//             {} as Record<string, { initial: number; available: number }>
//         );
//     }

//     return (
//         <div className="calendar__day long">
//             {!weekView ? (
//                 <h3 className="calendar__day--name">
//                     {dayName} {dayNumber}
//                 </h3>
//             ) : null}
//             {data.map((slot) => {
//                 const isHour = slot.time.endsWith(':00');
//                 const isHalf = slot.time.endsWith(':30');
//                 const decorationWidth = isHour ? 0 : isHalf ? 3 : 1;
//                 const shouldShowAppointment =
//                     slot.appointment &&
//                     appointmentSlotLength[slot.appointment.id].initial ===
//                         appointmentSlotLength[slot.appointment.id].available--;
//                 const { hue, saturation, lightness } = useMemo(
//                     () => randomHSLValues(),
//                     []
//                 );
//                 const slotStyles: Record<string, any> = {
//                     '--decoration-width': `${decorationWidth}`,
//                 };
//                 if (slot.time && isHour) {
//                     slotStyles['--slot-time'] = `'${slot.time}'`;
//                 }
//                 const appointmentStyles: Record<string, any> = {
//                     '--button-border-color': `hsla${hue}, ${saturation}%, ${lightness}%, 0.25)`,
//                     '--button-bg-color': `hsla(${hue}, ${saturation}%, ${lightness}%, 0.15)`,
//                 };
//                 if (slot.appointment && shouldShowAppointment) {
//                     appointmentStyles['--grid-rows'] =
//                         appointmentSlotLength[slot.appointment.id].initial;
//                 }
//                 return (
//                     <div
//                         className={`calendar__slot ${
//                             slot.appointment ? 'occupied' : 'unoccupied'
//                         }`}
//                         style={slotStyles}
//                         // data-appointment={slot.appointment?.id}
//                         key={date + slot.time}
//                     >
//                         {shouldShowAppointment ? (
//                             <Button
//                                 onClick={() =>
//                                     setAppointment(slot.appointment?.id)
//                                 }
//                                 className="calendar__slot--appointment"
//                                 style={appointmentStyles}
//                             >
//                                 {slot.appointment?.fullAddress}
//                             </Button>
//                         ) : null}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// function WeekCalendar({ weekData }: weekProps) {
//     console.log({ weekData });
//     return (
//         <div className="calendar__week">
//             <div className="weekday_initials">
//                 {shortWeekDay.map((initial, idx) => (
//                     <span className="initial" key={initial + idx}>
//                         {initial}
//                     </span>
//                 ))}
//             </div>
//             {weekData.map((day) => (
//                 <DayCalendar
//                     key={day.date.toString()}
//                     dayData={day}
//                     weekView={true}
//                 />
//             ))}
//         </div>
//     );
// }

// type monthProps = {
//     monthData: CalendarMonthType;
//     monthName: string;
// };

// function CompressedDay({ dayData }: dayProps) {
//     const { data, dayNumber, date, dayName } = dayData;

//     const dataToRender = useMemo(() => {
//         const updatedData = data.filter(
//             (slot) =>
//                 (slot.appointment !== null || slot.appointment !== undefined) &&
//                 slot.appointment?.localTime?.start === slot.time
//         );
//         return updatedData;
//     }, [data]);

//     return (
//         <div className="calendar__day compressed">
//             <h2 className="compressed__date">{dayNumber}</h2>
//             <div className="calendar__slots compressed">
//                 {dataToRender.map((slot) => {
//                     return (
//                         <span
//                             className="calendar__slot compressed"
//                             key={slot.time}
//                         >
//                             {/* <span className="calendar__slot--time">{slot.time}</span> */}
//                             <span className="calendar__slot--appointment">
//                                 <div>{slot.time}</div>
//                                 {slot.appointment?.fullAddress}
//                             </span>
//                         </span>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

// function MonthCalendar({ monthData, monthName }: monthProps) {
//     return (
//         <div className="calendar__month">
//             <h2>{monthName}</h2>
//             <div className="weekday_initials">
//                 {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((initial, idx) => (
//                     <span className="initial" key={initial + idx}>
//                         {initial}
//                     </span>
//                 ))}
//             </div>
//             {monthData.length
//                 ? monthData.map((week: CalendarWeekType, idx) => {
//                       return (
//                           <div
//                               key={idx + week[idx].date.toString()}
//                               className="calendar__week"
//                           >
//                               {week.map((day: CalendarDayType) => (
//                                   <CompressedDay
//                                       key={day.date.toString()}
//                                       dayData={day}
//                                   />
//                               ))}
//                           </div>
//                       );
//                   })
//                 : null}
//         </div>
//     );
// }
