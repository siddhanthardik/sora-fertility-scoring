import { promises as fs } from "fs";
import path from "path";

const settingsPath = path.join(process.cwd(), "data", "settings.json");

const defaultSettings = {
  widgetHostUrl: "http://localhost:3000",
  planLimits: {
    starter: 100,
    growth: 500,
    enterprise: null,
  }
};

export async function getSettings() {
  try {
    const content = await fs.readFile(settingsPath, "utf8");
    const parsed = JSON.parse(content);
    return { ...defaultSettings, ...parsed };
  } catch (error) {
    return defaultSettings;
  }
}

export async function updateSettings(newSettings) {
  const current = await getSettings();
  
  // Merge the new limits if provided
  let updatedLimits = current.planLimits;
  if (newSettings.planLimits) {
    updatedLimits = { ...current.planLimits };
    for (const [plan, limit] of Object.entries(newSettings.planLimits)) {
      if (limit === "" || limit === null || limit === "null" || limit === "Unlimited") {
        updatedLimits[plan] = null;
      } else {
        updatedLimits[plan] = Number(limit);
      }
    }
  }

  const updatedSettings = {
    ...current,
    planLimits: updatedLimits,
    widgetHostUrl: newSettings.widgetHostUrl !== undefined ? newSettings.widgetHostUrl : current.widgetHostUrl
  };

  await fs.mkdir(path.dirname(settingsPath), { recursive: true });
  await fs.writeFile(settingsPath, JSON.stringify(updatedSettings, null, 2), "utf8");
  
  return updatedSettings;
}
