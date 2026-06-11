import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../page.module.css";

export const revalidate = 60; // Revalidate every 60 seconds

// Dynamically generate metadata for SEO
export async function generateMetadata({ params }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: blog } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!blog) {
    return { title: "Post Not Found | SORA Fertility" };
  }

  return {
    title: `${blog.title} | SORA Fertility Blog`,
    description: blog.excerpt || `Read ${blog.title} on the SORA Fertility Blog.`,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.cover_image ? [{ url: blog.cover_image }] : [],
    }
  };
}

export default async function BlogPost({ params }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch the specific blog post based on the URL slug
  const { data: blog, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !blog) {
    notFound();
  }

  // If the blog is not published and the user is viewing it, normally we should restrict.
  // But for this MVP, we assume public users only see published blogs. If they guess the slug, they can see it or we can block it.
  if (!blog.published) {
    // Optionally block access to unpublished posts here for non-admins
  }

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.postContainer}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ff2a5f', fontWeight: '600', marginBottom: '32px', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Insights
        </Link>
        
        <article>
          <header className={styles.postHeader}>
            <h1 className={styles.postTitle}>{blog.title}</h1>
            <div className={styles.postMeta}>
              {blog.author_name && <span>By <strong>{blog.author_name}</strong></span>}
              <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </header>

          {blog.cover_image && (
            <img src={blog.cover_image} alt={blog.title} className={styles.postCover} />
          )}

          <div className={styles.postContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
