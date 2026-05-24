/**
 * Reusable site footer — injects on every page that includes footer.css + footer.js
 */
(function () {
  const SOCIAL_LINKS = [
    {
      href: "mailto:rajayush6200@gmail.com",
      label: "Email",
      icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
    },
    {
      href: "https://www.linkedin.com/in/rajayush6200/",
      label: "LinkedIn",
      icon: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>',
    },
    {
      href: "https://github.com/rajayush6200",
      label: "GitHub",
      icon: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>',
    },
    {
      href: "https://x.com/AyushRaj444",
      label: "Twitter",
      icon: '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>',
    },
    {
      href: "https://www.instagram.com/____ayush_raj____",
      label: "Instagram",
      icon: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>',
    },
  ];

  function svgIcon(paths) {
    return (
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      paths +
      "</svg>"
    );
  }

  function socialMarkup() {
    return SOCIAL_LINKS.map(function (item) {
      var isExternal = item.href.indexOf("http") === 0;
      var attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
      return (
        '<a href="' +
        item.href +
        '" class="social-icon" aria-label="' +
        item.label +
        '"' +
        attrs +
        ">" +
        svgIcon(item.icon) +
        "</a>"
      );
    }).join("");
  }

  function footerInnerHTML() {
    var year = new Date().getFullYear();
    return (
      '<hr class="site-footer__divider" aria-hidden="true">' +
      '<div class="site-footer__inner">' +
      '<div class="site-footer__social">' +
      socialMarkup() +
      "</div>" +
      '<p class="site-footer__brand">&copy; ' +
      year +
      " VITALINK &middot; Built by RAJ</p>" +
      '<nav class="site-footer__legal" aria-label="Legal">' +
      '<a href="privacy-policy.html">Privacy Policy</a>' +
      '<span class="site-footer__sep" aria-hidden="true">|</span>' +
      '<a href="terms-of-service.html">Terms of Service</a>' +
      "</nav>" +
      "</div>"
    );
  }

  function removeLegacyFooters() {
    document.querySelectorAll("footer:not(.site-footer)").forEach(function (el) {
      el.remove();
    });
  }

  function renderSiteFooter() {
    var existing = document.querySelector(".site-footer");
    if (existing) return existing;

    removeLegacyFooters();

    var footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.setAttribute("role", "contentinfo");
    footer.innerHTML = footerInnerHTML();
    document.body.appendChild(footer);
    return footer;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderSiteFooter);
  } else {
    renderSiteFooter();
  }

  window.renderSiteFooter = renderSiteFooter;
})();
