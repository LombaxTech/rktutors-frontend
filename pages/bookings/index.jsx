import { useState, useEffect } from "react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  return (
    <div className="bg-gray-200 flex-1">
      {bookings.length === 0 && <NoBookings />}
    </div>
  );
}

const NoBookings = () => (
  <div className="flex flex-col items-center gap-6 mt-16">
    <img src="img/void.svg" className="h-72" />
    <h1 className="text-4xl font-bold">No Bookings Available</h1>
  </div>
);
