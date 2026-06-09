import "server-only";
import { supabaseAdmin } from "./supabaseClient";

export async function getPackages() {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("sora_packages")
    .select("*")
    .order("price_inr", { ascending: true });
    
  if (error) {
    console.error("Error fetching packages from Supabase:", error);
    return [];
  }
  return data;
}

export async function getPackage(packageId) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from("sora_packages")
    .select("*")
    .eq("id", packageId)
    .single();
    
  if (error) return null;
  return data;
}

export async function updatePackage(packageId, updates) {
  if (!supabaseAdmin) throw new Error("Supabase is not configured.");
  
  const { data, error } = await supabaseAdmin
    .from("sora_packages")
    .update({
      name: updates.name,
      price_inr: updates.price_inr,
      assessment_limit: updates.assessment_limit,
      features: updates.features,
      is_active: updates.is_active,
      updated_at: new Date().toISOString()
    })
    .eq("id", packageId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createPackage(pkg) {
  if (!supabaseAdmin) throw new Error("Supabase is not configured.");
  
  const { data, error } = await supabaseAdmin
    .from("sora_packages")
    .insert([{
      id: pkg.id,
      name: pkg.name,
      price_inr: pkg.price_inr,
      assessment_limit: pkg.assessment_limit,
      features: pkg.features,
      is_active: true
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getSettings() {
  if (!supabaseAdmin) return { widgetHostUrl: "http://localhost:3000" };
  const { data, error } = await supabaseAdmin
    .from("sora_settings")
    .select("key, value");
    
  if (error) {
    console.error("Error fetching settings:", error);
    return { widgetHostUrl: "http://localhost:3000" };
  }
  
  const settings = { widgetHostUrl: "http://localhost:3000" };
  for (const row of data) {
    if (row.key === 'widgetHostUrl') settings.widgetHostUrl = row.value;
  }
  
  return settings;
}

export async function updateSettings(updates) {
  if (!supabaseAdmin) throw new Error("Supabase is not configured.");
  
  if (updates.widgetHostUrl !== undefined) {
    await supabaseAdmin
      .from("sora_settings")
      .upsert({ 
        key: 'widgetHostUrl', 
        value: updates.widgetHostUrl,
        updated_at: new Date().toISOString()
      });
  }
  
  return getSettings();
}
