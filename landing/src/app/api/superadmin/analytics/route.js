import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse date range
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "all";
    
    let query = supabase
      .from("sora_events")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply date filtering
    if (range !== "all") {
      const now = new Date();
      let cutoffDate = new Date();
      if (range === "7d") cutoffDate.setDate(now.getDate() - 7);
      else if (range === "30d") cutoffDate.setDate(now.getDate() - 30);
      else if (range === "this_month") cutoffDate.setDate(1); // 1st of current month
      
      query = query.gte("created_at", cutoffDate.toISOString());
    }

    const { data: events, error } = await query;

    if (error) {
      console.error("Error fetching analytics:", error);
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }

    // Process top-level metrics
    // A unique visitor is essentially a unique session_id
    const uniqueSessions = new Set(events.map(e => e.session_id)).size;
    
    // Today's visitors
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEvents = events.filter(e => new Date(e.created_at) >= today);
    const todayUsers = new Set(todayEvents.map(e => e.session_id)).size;

    const assessmentsCompleted = events.filter(e => e.event_name === "tool_completed").length;
    const reportsDownloaded = events.filter(e => e.event_name === "report_downloaded").length;

    // Revenue calculation (if revenue events exist)
    const revenueEvents = events.filter(e => e.event_name === "revenue_generated");
    const totalRevenue = revenueEvents.reduce((acc, curr) => acc + (curr.metadata?.revenue || curr.metadata?.amount || 0), 0);

    // Tools Analytics grouping
    const toolsMap = {};
    events.forEach(e => {
      if (!e.tool_name) return;
      if (!toolsMap[e.tool_name]) {
        toolsMap[e.tool_name] = { views: 0, starts: 0, completes: 0, downloads: 0, paid_downloads: 0 };
      }
      
      if (e.event_name === "tool_viewed") toolsMap[e.tool_name].views++;
      if (e.event_name === "tool_started") toolsMap[e.tool_name].starts++;
      if (e.event_name === "tool_completed") toolsMap[e.tool_name].completes++;
      if (e.event_name === "report_downloaded") toolsMap[e.tool_name].downloads++;
      if (e.event_name === "revenue_generated") toolsMap[e.tool_name].paid_downloads++;
    });

    const toolsAnalytics = Object.keys(toolsMap).map(tool => {
      const stats = toolsMap[tool];
      const rawCompletionRate = stats.starts > 0 ? Math.round((stats.completes / stats.starts) * 100) : 0;
      const completionRate = Math.min(100, rawCompletionRate); // Cap at 100%
      return {
        tool_name: tool,
        views: stats.views,
        starts: stats.starts,
        completes: stats.completes,
        downloads: stats.downloads,
        paid_downloads: stats.paid_downloads,
        completion_rate: completionRate
      };
    }).sort((a, b) => b.views - a.views);

    // Aggregate source data if we have it in metadata.source
    const sourceMap = {};
    events.filter(e => e.event_name === "tool_viewed").forEach(e => {
      const source = e.metadata?.source || "Direct / Unknown";
      if (!sourceMap[source]) sourceMap[source] = { visitors: 0, assessments: 0 };
      sourceMap[source].visitors++;
    });
    
    events.filter(e => e.event_name === "tool_completed").forEach(e => {
      const source = e.metadata?.source || "Direct / Unknown";
      if (sourceMap[source]) sourceMap[source].assessments++;
    });

    const trafficSources = Object.keys(sourceMap).map(source => ({
      source,
      visitors: sourceMap[source].visitors,
      assessments: sourceMap[source].assessments
    })).sort((a, b) => b.visitors - a.visitors);

    return NextResponse.json({
      summary: {
        totalVisitors: uniqueSessions,
        todayUsers: todayUsers,
        assessmentsCompleted,
        reportsDownloaded,
        revenue: totalRevenue,
        crmLeads: 0 // Fetch from clinics/leads if needed, mocking for now
      },
      toolsAnalytics,
      trafficSources
    });

  } catch (error) {
    console.error("Analytics route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
