import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
}

// Dynamically import CKEditor with SSR disabled
const CKEditorComponent = dynamic(
  () => import('@ckeditor/ckeditor5-react').then((mod) => {
    const { CKEditor } = mod;
    return function CKEditorWrapper(props: any) {
      return <CKEditor {...props} editor={require('@ckeditor/ckeditor5-build-classic')} />;
    };
  }),
  {
    ssr: false,
    loading: () => <div className="h-[200px] border rounded-lg bg-gray-50 animate-pulse" />
  }
);

const Editor = ({ value, onChange, placeholder, label, error, className = '' }: EditorProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <div className={twMerge(
        error ? "border-red-500" : "border-gray-300",
        className
      )}>
        <CKEditorComponent
          data={value}
          onChange={(_: any, editor: any) => {
            const data = editor.getData();
            onChange(data);
          }}
          config={{
            placeholder: placeholder,
            toolbar: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'codeBlock',
              'blockQuote',
              '|',
              'undo',
              'redo'
            ],
            heading: {
              options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
              ]
            }
          }}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Editor; 