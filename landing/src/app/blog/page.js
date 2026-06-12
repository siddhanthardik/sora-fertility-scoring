import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 60;

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
    title: "SORA Fertility Blog | Clinical Insights & Research",
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

  const hasBlogs = blogs && blogs.length > 0;
  
  // Use real data if available, otherwise fallback to premium placeholder data to showcase the design
  const featuredPost = hasBlogs ? blogs[0] : {
    slug: "understanding-pcos-phenotypes",
    title: "Understanding the 4 Phenotypes of PCOS: A Clinical Guide",
    excerpt: "Polycystic Ovary Syndrome isn't a monolith. Recent clinical consensus outlines four distinct phenotypes. Here's what they mean for your fertility journey and treatment protocols.",
    cover_image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
    created_at: new Date().toISOString(),
    author_name: "Dr. Sarah Jenkins"
  };

  const gridPosts = hasBlogs ? blogs.slice(1) : [
    {
      id: 2,
      slug: "ivf-success-rates-2026",
      title: "Demystifying IVF Success Rates in 2026",
      excerpt: "How predictive AI and machine learning are shifting the baseline for embryo selection and IVF success globally.",
      cover_image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop",
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      author_name: "Dr. Michael Chen"
    },
    {
      id: 3,
      slug: "diet-and-egg-quality",
      title: "Can Diet Actually Improve Egg Quality?",
      excerpt: "Separating fact from fiction: A deep dive into the latest nutritional research regarding oocyte competence and metabolic health.",
      cover_image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      author_name: "Amanda Wright, RD"
    },
    {
      id: 4,
      slug: "sora-product-update-q2",
      title: "SORA Product Update: Q2 New Features",
      excerpt: "Introducing frictionless patient lead capture, native cycle tracking, and our updated clinical BMI calculators.",
      cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
      author_name: "SORA Product Team"
    }
  ];

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.blogHero}>
        <h1 className={styles.heroTitle}>SORA Fertility Insights</h1>
        <p className={styles.heroDesc}>Expert perspectives on fertility technology, clinical workflows, and patient experiences.</p>
        
        <div className={styles.categoryPills}>
          <button className={`${styles.pill} ${styles.pillActive}`}>All Articles</button>
          <button className={styles.pill}>Clinical Research</button>
          <button className={styles.pill}>Patient Guides</button>
          <button className={styles.pill}>Product Updates</button>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        
        {/* Featured Post */}
        <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredPost}>
          <img src={featuredPost.cover_image} alt={featuredPost.title} className={styles.featuredImage} />
          <div className={styles.featuredContent}>
            <div className={styles.badge}>Featured Article</div>
            <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
            <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
            <div className={styles.cardDate} style={{ marginBottom: 0 }}>
              {new Date(featuredPost.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {featuredPost.author_name && ` • By ${featuredPost.author_name}`}
            </div>
          </div>
        </Link>

        {/* Grid Posts */}
        <div className={styles.grid}>
          {gridPosts.map(blog => (
            <Link href={`/blog/${blog.slug}`} key={blog.id} className={styles.blogCard}>
              {blog.cover_image && (
                <img src={blog.cover_image} alt={blog.title} className={styles.cardImage} />
              )}
              <div className={styles.cardContent}>
                <div className={styles.cardDate}>
                  {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <h2 className={styles.cardTitle}>{blog.title}</h2>
                <p className={styles.cardExcerpt}>{blog.excerpt}</p>
                <div className={styles.readMore}>Read Article <ArrowRight size={14} /></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Box */}
        <div className={styles.newsletter}>
          <h3 className={styles.newsletterTitle}>Stay updated on clinical fertility tech</h3>
          <p style={{ color: '#475569', margin: 0 }}>Join 2,000+ clinicians and patients receiving our monthly insights.</p>
          <form className={styles.newsletterForm}>
            <input type="email" placeholder="Enter your email address" className={styles.newsletterInput} />
            <button type="button" className={styles.newsletterBtn}>Subscribe</button>
          </form>
        </div>

      </div>

      <Footer />
    </div>
  );
}
