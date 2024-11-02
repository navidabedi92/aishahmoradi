"use client";
import { Store } from "@/store/store";
import Login from "./Login";
import { Provider } from "react-redux";

export default function LoginProfile() {
  return (
    <Provider store={Store}>
      <Login />
    </Provider>
  );
}
