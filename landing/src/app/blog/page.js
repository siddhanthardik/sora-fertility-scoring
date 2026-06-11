import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data } = await supabase.from("seo_settings").select("*").eq("page_route", "/blog").single();

  if (data) {
    return {
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_keywords,
    };
  }

  return {
    title: "SORA Fertility Blog | Insights & Research",
    description: "Read the latest clinical insights, product updates, and fertility research from the SORA team.",
  };
}

export default async function BlogIndex() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: blogs } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.blogHero}>
        <h1 className={styles.heroTitle}>SORA Fertility Insights</h1>
        <p className={styles.heroDesc}>Expert perspectives on fertility technology, clinical workflows, and patient experiences.</p>
      </div>

      <div className={styles.grid}>
        {(blogs || []).map(blog => (
          <Link href={`/blog/${blog.slug}`} key={blog.id} className={styles.blogCard}>
            {blog.cover_image && (
              <img src={blog.cover_image} alt={blog.title} className={styles.cardImage} />
            )}
            <div className={styles.cardContent}>
              <div className={styles.cardDate}>
                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {blog.author_name && ` • By ${blog.author_name}`}
              </div>
              <h2 className={styles.cardTitle}>{blog.title}</h2>
              <p className={styles.cardExcerpt}>{blog.excerpt}</p>
              <div className={styles.readMore}>Read Article <ArrowRight size={14} /></div>
            </div>
          </Link>
        ))}
        {(!blogs || blogs.length === 0) && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: '#64748b' }}>
            No articles published yet. Check back soon!
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
