import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MarkdownRenderer.css';

function sanitizeMarkdown(text) {
  if (!text) return '';

  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(div|span|p|b|i|strong|em|ul|li|ol)[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function MarkdownRenderer({ content }) {

  const cleanedContent = sanitizeMarkdown(content);

  const isRiskTable =
    cleanedContent.includes('Risk ID') &&
    cleanedContent.includes('Probability') &&
    cleanedContent.includes('Impact');

  return (
    <div className="markdown-body">

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{

          table({ children }) {
            return (
              <table className="markdown-table">
                {children}
              </table>
            );
          },

          tr({ children }) {

            if (!isRiskTable) {
              return <tr>{children}</tr>;
            }

            const text = children
              ?.map((child) => {
                if (typeof child?.props?.children === 'string') {
                  return child.props.children;
                }

                if (Array.isArray(child?.props?.children)) {
                  return child.props.children.join('');
                }

                return '';
              })
              .join(' ');

            let className = '';

            if (text.includes('9')) {
              className = 'risk-row-critical';
            }

            else if (
              text.includes('6') ||
              text.includes('7') ||
              text.includes('8')
            ) {
              className = 'risk-row-high';
            }

            else if (
              text.includes('4') ||
              text.includes('5')
            ) {
              className = 'risk-row-medium';
            }

            else if (
              text.includes('1') ||
              text.includes('2') ||
              text.includes('3')
            ) {
              className = 'risk-row-low';
            }

            return (
              <tr className={className}>
                {children}
              </tr>
            );
          },

        }}
      >
        {cleanedContent}
      </ReactMarkdown>

    </div>
  );
}