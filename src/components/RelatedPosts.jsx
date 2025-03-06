import Link from "next/link";
import { useEffect, useState } from "react";

// components/RelatedPosts.jsx
export default function RelatedPosts({ currentId, category, tags, type }) {
    const [relatedContent, setRelatedContent] = useState([]);
    
    useEffect(() => {
      async function fetchRelated() {
        // Fetch related content based on same category or tags
        const response = await fetch(`/api/${type}/related?id=${currentId}&category=${category}&tags=${tags.join(',')}`);
        const data = await response.json();
        setRelatedContent(data);
      }
      
      fetchRelated();
    }, [currentId, category, tags, type]);
    
    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Related Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedContent.map(item => (
            <Link 
              href={`/${type}/${item._id}`} 
              key={item._id}
              className="p-4 border rounded hover:bg-gray-50"
            >
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{item.subtitle || item.content.substring(0, 80)}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }