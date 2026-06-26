/**
 * SORA Meta Pixel Helper
 * ──────────────────────
 * Centralised wrapper around the Meta Pixel (fbq) SDK.
 * All pixel calls should go through this module — never call fbq() directly.
 *
 * Pixel ID is driven by NEXT_PUBLIC_META_PIXEL_ID so we never hard-code it.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * SSR guard — returns true only when fbq is available on the window.
 */
function isPixelReady() {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

/**
 * Fire a Meta *standard* event (built-in events like PageView, Lead, etc.)
 * @param {string} eventName  - Standard Meta event name e.g. 'PageView', 'Lead'
 * @param {object} [params]   - Optional event parameters
 */
export function trackMetaStandard(eventName, params = {}) {
  if (!isPixelReady()) return;
  try {
    if (Object.keys(params).length > 0) {
      window.fbq("track", eventName, params);
    } else {
      window.fbq("track", eventName);
    }
  } catch (err) {
    console.warn("[Meta Pixel] Failed to fire standard event:", eventName, err);
  }
}

/**
 * Fire a Meta *custom* event (SORA-specific events).
 * @param {string} eventName  - Custom event name e.g. 'FertilityAssessmentCompleted'
 * @param {object} [params]   - Optional event parameters
 */
export function trackMetaCustom(eventName, params = {}) {
  if (!isPixelReady()) return;
  try {
    if (Object.keys(params).length > 0) {
      window.fbq("trackCustom", eventName, params);
    } else {
      window.fbq("trackCustom", eventName);
    }
  } catch (err) {
    console.warn("[Meta Pixel] Failed to fire custom event:", eventName, err);
  }
}

/**
 * EVENT MAP
 * ─────────
 * Maps SORA internal {event, tool} pairs to Meta custom event names.
 *
 * Structure:
 *   EVENT_MAP[tool_name][event_name] = MetaEventName | function(metadata) => MetaEventName[]
 *
 * A function value allows one SORA event to fire MULTIPLE Meta events
 * (e.g. IVF due date fires both DueDateCalculated + IVFDueDateCalculated).
 */
export const EVENT_MAP = {
  // ── Fertility Assessment ──────────────────────────────────────────────────
  fertility_assessment: {
    tool_viewed:    "FertilityAssessmentStarted",
    tool_completed: "FertilityAssessmentCompleted",
  },

  // ── PCOS Assessment ───────────────────────────────────────────────────────
  pcos_assessment: {
    tool_viewed:    "PCOSAssessmentStarted",
    tool_completed: "PCOSAssessmentCompleted",
  },

  // ── Due Date Calculator ───────────────────────────────────────────────────
  due_date_calculator: {
    tool_viewed: "DueDateCalculatorViewed",

    // Returns multiple events when the method is IVF-based
    tool_completed: (metadata = {}) => {
      const method = (metadata.method || "").toLowerCase();
      const events = ["DueDateCalculated"];
      if (method.includes("ivf") || method.includes("embryo")) {
        events.push("IVFDueDateCalculated");
      }
      return events;
    },
  },

  // ── Egg Freezing Planner ──────────────────────────────────────────────────
  egg_freezing_planner: {
    tool_viewed:    "EggFreezingPlannerViewed",
    tool_completed: "EggFreezingPlannerCompleted",
  },

  // ── AMH Interpreter ───────────────────────────────────────────────────────
  amh_interpreter: {
    tool_viewed:    "AMHInterpreterViewed",
    tool_completed: "AMHInterpreted",
  },
};

/**
 * Bridge function — called by src/lib/analytics.js trackEvent().
 * Looks up the correct Meta event name(s) and fires them.
 *
 * @param {string} event    - SORA event name e.g. 'tool_completed'
 * @param {string} tool     - SORA tool name e.g. 'due_date_calculator'
 * @param {object} metadata - Any extra metadata passed to trackEvent()
 */
export function bridgeToMetaPixel(event, tool, metadata = {}) {
  if (!META_PIXEL_ID || !isPixelReady()) return;

  const toolMap = EVENT_MAP[tool];
  if (!toolMap) return;

  const mapping = toolMap[event];
  if (!mapping) return;

  // Resolve: string | string[] | function → string[]
  let metaEvents = [];
  if (typeof mapping === "function") {
    const result = mapping(metadata);
    metaEvents = Array.isArray(result) ? result : [result];
  } else if (Array.isArray(mapping)) {
    metaEvents = mapping;
  } else {
    metaEvents = [mapping];
  }

  // Fire each resolved Meta event
  metaEvents.forEach((metaEventName) => {
    trackMetaCustom(metaEventName);
  });
}
