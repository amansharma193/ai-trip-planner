import { db } from "@/service/FirebaseConfig";
import { Trip } from "@/types/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTripCard from "./components/UserTripCard";

const MyTrips = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  useEffect(() => {
    getUserTrips();
  }, []);

  const getUserTrips = async () => {
    if (!user.email) {
      navigate("/");
      return;
    }
    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", user.email)
    );
    const docSnaps = await getDocs(q);

    docSnaps.forEach((doc) =>
      setUserTrips((prevValue: Trip[]) => [...prevValue, doc.data() as Trip])
    );
    return () => setUserTrips([]);
  };
  return (
    <div className="px-[18vw]">
      <h2 className="font-bold text-3xl">My Trips</h2>
      <div className="grid grid-cols-2 mt-10 md:grid-cols-3 gap-5">
        {userTrips.length > 0
          ? userTrips.map((trip: Trip, index: number) => (
              <UserTripCard trip={trip} key={index} />
            ))
          : [1, 2, 3, 4, 5, 6].map((item: number, index: number) => (
              <div
                key={index + item}
                className="h-[220px] w-full bg-slate-200 animate-pulse rounded-xl"
              ></div>
            ))}
      </div>
    </div>
  );
};

export default MyTrips;
