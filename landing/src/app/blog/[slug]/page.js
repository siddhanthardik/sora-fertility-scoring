import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Activity, CalendarHeart, Scale, Baby, Snowflake } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../page.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 60;

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

  // Use the new SEO fields if available, otherwise fallback to existing logic
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: blog, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
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

  return (
    <div className={styles.container}>
      <Navbar />
      
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className={styles.postContainer} style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 120px' }}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: '600', marginBottom: '32px', textDecoration: 'none', transition: 'color 0.2s' }}>
          <ArrowLeft size={16} /> Back to Learning Hub
        </Link>
        
        <article>
          <header style={{ marginBottom: '40px' }}>
            {blog.category && (
              <span style={{ background: '#fce7f3', color: '#e11d48', fontSize: '0.75rem', fontWeight: '700', padding: '6px 16px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', display: 'inline-block' }}>
                {blog.category}
              </span>
            )}
            <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2', marginBottom: '24px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              {blog.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '0.95rem' }}>
              {blog.author_name && <span style={{ fontWeight: '600', color: '#1e293b' }}>By {blog.author_name}</span>}
              <span>•</span>
              <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </header>

          {blog.cover_image && (
            <div style={{ marginBottom: '48px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
              <img src={blog.cover_image} alt={blog.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}

          <div 
            className="prose prose-lg prose-pink max-w-none"
            style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#334155' }}
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
        </article>

        {/* Dynamic CTA if Related Tool exists */}
        {relatedTool && (
          <div style={{ marginTop: '80px', background: '#e0e7ff', borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid #c7d2fe', boxShadow: '0 10px 30px rgba(67, 56, 202, 0.1)' }}>
            <div style={{ background: 'white', padding: '16px', borderRadius: '50%', marginBottom: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              {relatedTool.icon}
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>
              Wondering about your timing?
            </h3>
            <p style={{ fontSize: '1.1rem', color: '#4338ca', marginBottom: '32px', maxWidth: '500px' }}>
              {relatedTool.description} Try the free {relatedTool.title}.
            </p>
            <Link href={relatedTool.href} style={{ background: '#4338ca', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(67, 56, 202, 0.4)', transition: 'transform 0.2s' }}>
              Use {relatedTool.title} <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
