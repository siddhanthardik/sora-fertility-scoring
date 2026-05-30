(function() {
  const currentScript = document.currentScript;
  if (!currentScript) {
    console.error("SORA Fertility Widget: Could not locate current script tag.");
    return;
  }

  const clinicId = currentScript.getAttribute("data-clinic-id");
  if (!clinicId) {
    console.error("SORA Fertility Widget: Missing data-clinic-id attribute.");
    return;
  }

  const scriptUrl = new URL(currentScript.src);
  const hostUrl = scriptUrl.origin; // e.g. http://localhost:3000

  const container = document.querySelector("[data-sora-fertility-widget]");
  if (!container) {
    console.error("SORA Fertility Widget: Could not find container element <div data-sora-fertility-widget></div>");
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.src = `${hostUrl}/widget?clinicId=${encodeURIComponent(clinicId)}`;
  iframe.style.width = "100%";
  iframe.style.height = "700px";
  iframe.style.border = "none";
  iframe.style.borderRadius = "12px";
  iframe.style.overflow = "hidden";
  iframe.setAttribute("allow", "clipboard-write"); // needed if we have copy buttons
  iframe.title = "SORA Fertility Assessment";

  container.innerHTML = "";
  container.appendChild(iframe);
})();
