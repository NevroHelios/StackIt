"use client";

import { useEffect } from "react";

import parse from "html-react-parser";
import Prism from "prismjs";

// Import only the base Prism.js CSS and the line-numbers plugin CSS
import "prismjs/themes/prism-tomorrow.css"; // Or your preferred theme
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface Props {
  data: string;
}

const ParseHTML = ({ data }: Props) => {
  useEffect(() => {
    const loadPrismLanguages = async () => {
      // Dynamically import common languages you expect to use
      // You can add more as needed based on your content
      await Promise.all([
        import("prismjs/components/prism-javascript"),
        import("prismjs/components/prism-typescript"),
        import("prismjs/components/prism-jsx"),
        import("prismjs/components/prism-tsx"),
        import("prismjs/components/prism-css"),
        import("prismjs/components/prism-markup"), // For HTML
        import("prismjs/components/prism-json"),
        import("prismjs/components/prism-bash"),
        import("prismjs/components/prism-python"),
        import("prismjs/components/prism-java"),
        import("prismjs/components/prism-csharp"),
        // Add other languages you commonly use here
      ]).then(() => {
        Prism.highlightAll();
      });
    };
    loadPrismLanguages();
  }, [data]); // Re-run effect if data changes
  return <div className="markdown w-full min-w-0 max-w-full overflow-hidden break-words overflow-x-auto">{parse(data)}</div>;
};

export default ParseHTML;
