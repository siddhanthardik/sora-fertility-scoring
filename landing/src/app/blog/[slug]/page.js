import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Activity, CalendarHeart, Scale, Baby, Snowflake } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SubscribeForm from "../../components/SubscribeForm";
import SocialShare from "../../components/SocialShare";
import AdsterraAd from "../../components/AdsterraAd";
import styles from "../page.module.css";


export async function generateMetadata({ params }) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const resolvedParams = await params;
      const { data: blog } = await supabase.from("blog_posts").select("*").eq("slug", resolvedParams.slug).single();

      if (blog) {
        return {
          title: blog.meta_title || `${blog.title} | SORA Fertility Blog`,
          description: blog.meta_description || blog.excerpt || `Read ${blog.title} on the SORA Fertility Blog.`,
          keywords: blog.meta_keywords || "",
          openGraph: {
            title: blog.meta_title || blog.title,
            description: blog.meta_description || blog.excerpt,
            images: blog.cover_image ? [{ url: blog.cover_image }] : [],
            type: "article",
            publishedTime: blog.created_at,
            authors: blog.author_name ? [blog.author_name] : []
          }
        };
      }
    }
  } catch (error) {
    console.error("Metadata error:", error);
  }
  
  return { title: "Post Not Found | SORA Fertility" };
}



// Map related_tool to friendly titles and paths
const TOOL_MAP = {
  "egg-freezing-planner": {
    title: "Egg Freezing Planner™",
    description: "Understand your future fertility options and timeline based on age and clinical factors.",
    href: "/tools/egg-freezing-planner",
    icon: <Snowflake size={32} color="#4338ca" />
  },
  "fertility-assessment": {
    title: "Fertility Assessment",
    description: "Get a personalized risk assessment based on clinical guidelines.",
    href: "/fertility-assessment",
    icon: <Activity size={32} color="#4338ca" />
  },
  "pcos-assessment": {
    title: "PCOS Risk Assessment",
    description: "Evaluate your symptoms against clinical criteria for PCOS.",
    href: "/pcos-assessment",
    icon: <Activity size={32} color="#4338ca" />
  },
  "due-date-calculator": {
    title: "Due Date Calculator",
    description: "Calculate your estimated due date for natural pregnancy, IUI, and IVF.",
    href: "/tools/due-date-calculator",
    icon: <Baby size={32} color="#4338ca" />
  },
  "ovulation-calculator": {
    title: "Ovulation Calculator",
    description: "Estimate your fertile window to optimize your chances of conceiving.",
    href: "/tools/ovulation-calculator",
    icon: <CalendarHeart size={32} color="#4338ca" />
  }
};

export default async function BlogPost({ params }) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return <div style={{ padding: '100px', textAlign: 'center' }}>Error: Supabase environment variables are missing.</div>;
    }

    const resolvedParams = await params;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: blog, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", resolvedParams.slug)
      .single();

    if (error || !blog) {
      notFound();
    }

  // JSON-LD Structured Data for AI Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.meta_title || blog.title,
    "description": blog.meta_description || blog.excerpt,
    "image": blog.cover_image ? [blog.cover_image] : [],
    "datePublished": new Date(blog.created_at).toISOString(),
    "dateModified": new Date(blog.updated_at).toISOString(),
    "author": [{
      "@type": "Person",
      "name": blog.author_name || "SORA Team"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "SORA Fertility",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sorafertility.com/sora-logo.png"
      }
    }
  };

    const relatedTool = blog.related_tool && TOOL_MAP[blog.related_tool] ? TOOL_MAP[blog.related_tool] : null;

    // Fetch related posts (same category, exclude current post)
    let { data: relatedPosts } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image, created_at")
      .eq("category", blog.category)
      .neq("id", blog.id)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (!relatedPosts || relatedPosts.length === 0) {
      const { data: fallbackPosts } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, created_at")
        .neq("id", blog.id)
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      relatedPosts = fallbackPosts;
    }

    // Format date safely for Server Component
    const blogDate = new Date(blog.created_at);
    const formattedDate = blogDate.toISOString().split('T')[0];

  return (
    <div className={styles.container}>
      <Navbar />
      
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main style={{ paddingBottom: '120px' }}>
        {/* Full-width Hero Image */}
        {blog.cover_image && (
          <div style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
            <img src={blog.cover_image} alt={blog.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 0' }}>
          <div style={{ display: 'flex', gap: '64px', flexDirection: 'row', alignItems: 'flex-start' }}>
            {/* Main Content Column */}
            <div style={{ flex: 1, maxWidth: '800px' }}>
              <div style={{ marginBottom: '32px' }}>
                <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>
                  <ArrowLeft size={16} /> Back to Learning Hub
                </Link>
              </div>

              <header style={{ width: '100%', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.1', marginBottom: '16px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', width: '100%', textWrap: 'auto' }}>
                  {blog.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '1rem' }}>
                  {blog.author_name && <span style={{ fontWeight: '600', color: '#1e293b' }}>By {blog.author_name}</span>}
                  <span>•</span>
                  <span>{formattedDate}</span>
                  {blog.category && (
                    <>
                      <span>•</span>
                      <span style={{ color: '#e11d48', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {blog.category}
                      </span>
                    </>
                  )}
                </div>
                
                <SocialShare title={blog.title} />
              </header>

              <div style={{ marginBottom: '32px' }}>
                <AdsterraAd size="728x90" className="ad-desktop-only" />
                <AdsterraAd size="300x250" className="ad-mobile-only" />
              </div>

              <div 
                className={styles.blogContent}
                dangerouslySetInnerHTML={{ __html: blog.content }} 
                style={{ maxWidth: '100%' }}
              />

              {/* Sleek CTA Banner */}
              {relatedTool && (
                <div className={styles.ctaBanner} style={{ width: '100%', marginTop: '60px' }}>
                  <div className={styles.ctaBannerContent}>
                    <h3 className={styles.ctaBannerTitle}>Wondering about your timing?</h3>
                    <p className={styles.ctaBannerDesc}>{relatedTool.description} Try the free {relatedTool.title}.</p>
                  </div>
                  <Link href={relatedTool.href} className={styles.ctaBannerBtn}>
                    Use {relatedTool.title} <ArrowRight size={18} />
                  </Link>
                </div>
              )}

              {/* FAQs */}
              {blog.faqs && blog.faqs.length > 0 && (
                <div className={styles.faqContainer}>
                  <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
                  {blog.faqs.map((faq, idx) => (
                    <div key={idx} className={styles.faqItem}>
                      <h3 className={styles.faqQuestion}>{faq.question}</h3>
                      <p className={styles.faqAnswer}>{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <aside style={{ width: '320px', position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>
              <SubscribeForm source={`blog/${blog.slug}`} />
              <AdsterraAd size="300x250" />
              <AdsterraAd size="160x300" />
            </aside>
          </div>



          {/* Related Posts Section */}
          {relatedPosts && relatedPosts.length > 0 && (
            <section className={styles.relatedPosts}>
              <h2 className={styles.relatedTitle}>Related Articles</h2>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className={styles.blogCard}>
                    {post.cover_image && (
                      <img src={post.cover_image} alt={post.title} className={styles.cardImage} />
                    )}
                    <div className={styles.cardContent}>
                      <span className={styles.cardDate}>{new Date(post.created_at).toISOString().split('T')[0]}</span>
                      <h3 className={styles.cardTitle}>{post.title}</h3>
                      <p className={styles.cardExcerpt}>{post.excerpt && post.excerpt.substring(0, 100)}...</p>
                      <span className={styles.readMore}>Read Article <ArrowRight size={16} /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
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
