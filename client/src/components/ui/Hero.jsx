'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

export default function Hero({ content }) {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    if (typeof content === 'string') {
      if (content.startsWith('/') || content.startsWith('http')) {
        fetch(content)
          .then((res) => res.text())
          .then((text) => setMarkdown(text))
          .catch(() => setMarkdown(''));
      } else {
        setMarkdown(content);
      }
    } else {
      setMarkdown('');
    }
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-12 md:p-16 mb-16"
    >
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-display-1 font-serif text-brand-primary mb-6" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-display-2 font-serif text-brand-primary mt-8 mb-4" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-body-lg text-brand-muted mb-6 leading-relaxed" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-brand-primary" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside mb-6 space-y-2 text-brand-muted text-body-lg" {...props} />
            ),
            em: ({ node, ...props }) => (
              <em className="italic text-brand-gold" {...props} />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}

