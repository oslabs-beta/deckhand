import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../deckhandSlice";

export default function FloatTheme() {
  const state = useSelector((state: any) => state.deckhand);
  const dispatch = useDispatch();

  const newTheme = state.user.theme === "light" || !state.user.theme ? "dark" : "light";

  const lightIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={4} strokeLinejoin="round"></circle><path strokeLinecap="round" d="M20 12h1M3 12h1m8 8v1m0-18v1m5.657 13.657l.707.707M5.636 5.636l.707.707m0 11.314l-.707.707M18.364 5.636l-.707.707"></path></g></svg>;
  const darkIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21q-3.75 0-6.375-2.625T3 12t2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21m0-2q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.075 0-5.238-2.163T9.1 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5 12q0 2.9 2.05 4.95T12 19m-.25-6.75"></path></svg>;

  return (
    <div
      className="float-theme"
      onClick={() => {
        dispatch(setUser({ theme: newTheme }));
        document.body.classList.toggle("dark-mode");
      }}>
        {newTheme === "light" ? lightIcon : darkIcon}
    </div>
  );
}
