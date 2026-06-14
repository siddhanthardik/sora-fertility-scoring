import { createClient } from "@supabase/supabase-js";

export default async function sitemap() {
  const baseUrl = "https://sorafertility.com";

  // Define your core static routes
  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/clinic",
    "/contact",
    "/cookie-policy",
    "/crm",
    "/fertility-assessment",
    "/pcos-assessment",
    "/privacy-policy",
    "/sample-report",
    "/terms-of-service",
    "/tools"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? 'weekly' : 'monthly',
    priority: route === "" ? 1 : 0.8,
  }));

  // Fetch dynamic routes (e.g., published blog posts)
  let dynamicRoutes = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("slug, updated_at")
        .eq("published", true);

      if (posts) {
        dynamicRoutes = posts.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || new Date()).toISOString(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    console.error("Error generating sitemap for dynamic routes:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
