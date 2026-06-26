import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdsterraAd from "../components/AdsterraAd";
import styles from "./page.module.css";

import { buildMetadata, getStructuredData } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata("/blog", "SORA Fertility Blog | Clinical Insights & Research", "Read the latest clinical insights, product updates, and fertility research from the SORA team.");
}

export default async function BlogIndex({ searchParams }) {
  const jsonLd = await getStructuredData("/blog");

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return <div style={{ padding: '100px', textAlign: 'center' }}>Error: Supabase environment variables are missing.</div>;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    // Handle searchParams safely
    const params = (await searchParams) || {};
    const selectedCategory = params.category || "All";
    
    if (selectedCategory !== "All") {
      query = query.eq("category", selectedCategory);
    }

    const { data: blogs, error } = await query;
    
    if (error) {
      return <div style={{ padding: '100px', textAlign: 'center' }}>Database Error: {error.message}</div>;
    }
    
    const hasBlogs = blogs && blogs.length > 0;

  const categories = ["All", "Fertility", "PCOS", "Pregnancy", "Egg Freezing"];

  return (
    <div className={styles.container}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <Navbar />
      
      <div className={styles.blogHero} style={{ background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)', padding: '100px 24px', textAlign: 'center', borderBottom: '1px solid #fce7f3' }}>
        <h1 className={styles.heroTitle} style={{ fontSize: '3.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '48px', fontFamily: 'var(--font-display)' }}>SORA Learning Hub</h1>
        
        <div className={styles.categoryPills} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          {categories.map((cat) => (
            <Link key={cat} href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`} style={{ textDecoration: 'none' }}>
              <button 
                className={styles.pill} 
                style={{
                  padding: '10px 24px',
                  borderRadius: '100px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: 'none',
                  fontSize: '1rem',
                  background: selectedCategory === cat ? '#f43f5e' : 'white',
                  color: selectedCategory === cat ? 'white' : '#64748b',
                  boxShadow: selectedCategory === cat ? '0 4px 15px rgba(244, 63, 94, 0.4)' : '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            </Link>
          ))}
        </div>
      </div>

      <main className={styles.mainGrid} style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
        {hasBlogs ? (
          blogs.map((post, index) => (
            <React.Fragment key={post.id}>
              <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article 
                  style={{ 
                    background: 'white', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
                    border: '1px solid #f1f5f9',
                    transition: 'all 0.3s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {post.cover_image ? (
                    <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                      <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '200px', width: '100%', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={48} color="#fbcfe8" />
                    </div>
                  )}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                      {post.category || "General"}
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px', lineHeight: '1.4' }}>
                      {post.title}
                    </h2>
                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: '700', fontSize: '0.95rem' }}>
                      Read Article <ArrowRight size={16} />
                    </div>
                  </div>
                </article>
              </Link>
              
              {/* Inject Native-feeling Ad every 4 posts */}
              {(index === 1 || index === 5 || index === 9) && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: '#f8fafc', 
                  borderRadius: '16px', 
                  border: '1px dashed #e2e8f0',
                  minHeight: '250px'
                }}>
                  <AdsterraAd size="300x250" />
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 20px' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px' }}>No articles found</h3>
            <p style={{ color: '#64748b' }}>Check back soon for new insights in the {selectedCategory} category.</p>
            {selectedCategory !== "All" && (
              <Link href="/blog" style={{ display: 'inline-block', marginTop: '24px', color: '#f43f5e', fontWeight: '700', textDecoration: 'none' }}>
                View all categories
              </Link>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
  } catch (err) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <h2>Unexpected Server Error</h2>
        <p>{err.message || String(err)}</p>
      </div>
    );
  }
}
