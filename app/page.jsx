"use client"
import BlogList from "@/Components/BlogList";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { Subscribe } from "@/Components/Subscribe";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <>
      <ToastContainer theme="dark" />
      <Header />
      <Subscribe />
      <BlogList />
      <Footer />
    </>
  );
}
