import React from "react";
import ReactDOM from "react-dom/client";
import Hero from "./Hero/Hero.jsx";
import heroStyles from "./Hero/Hero.css?inline";

const injectReact = () => {
  const anchor = document.querySelector("#below");

  if (anchor && !document.querySelector("#study-companion-root")) {
    const container = document.createElement("div");
    container.id = "study-companion-root";
    anchor.prepend(container);

    const shadow = container.attachShadow({ mode: "open" });

    // Inject the CSS directly into the Shadow Root
    const styleTag = document.createElement("style");
    styleTag.textContent = heroStyles;
    shadow.appendChild(styleTag);

    const innerRoot = document.createElement("div");
    shadow.appendChild(innerRoot);

    const root = ReactDOM.createRoot(innerRoot);
    root.render(<Hero />);
  }
};

// Listen for YouTube's SPA navigation
const observer = new MutationObserver(() => {
  if (window.location.href.includes("watch")) {
    injectReact();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
