import BlogList from "@/Components/BlogList";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { Subscribe } from "@/Components/Subscribe";

async function getBlogs() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/blog?public=true`, { cache: 'no-store' });
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.blogs || []; 
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <>
      <Header />
      <Subscribe />
      <BlogList initialBlogs={blogs} />
      <Footer />
    </>
  );
}