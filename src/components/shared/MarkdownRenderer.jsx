import ReactMarkdown from 'react-markdown';
import './MarkdownRenderer.css';

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
