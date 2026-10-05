import { useEffect, useState } from "react";

/**
 * Forces every outside link (LinkedIn, WhatsApp, GitHub, live apps) to open in a
 * fresh top-level browser tab. Sites like LinkedIn refuse to load inside embedded
 * frames, so a link must never navigate the current (possibly framed) page.
 * When the browser blocks the new tab, the URL is returned so the page can show
 * a manual "open / copy" notice instead.
 */
export function useExternalLinks() {
  const [blockedUrl, setBlockedUrl] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.hasAttribute("download")) return;
      const raw = anchor.getAttribute("href") ?? "";
      if (!raw || raw === "#") {
        event.preventDefault();
        return;
      }
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (!/^https?:$/.test(url.protocol) || url.origin === window.location.origin) return;

      event.preventDefault();
      const win = window.open(url.href, "_blank");
      if (win) {
        try { win.opener = null; } catch { /* cross-origin, already isolated */ }
        setBlockedUrl(null);
      } else {
        setBlockedUrl(url.href);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return { blockedUrl, dismiss: () => setBlockedUrl(null) };
}
