// // import React, { useState, useRef, useEffect } from 'react';
// // import ReactQuill from 'react-quill';
// // import 'react-quill/dist/quill.snow.css'; // Import Quill styles

// // function Editor() {
// //     const [editorValue, setEditorValue] = useState('');
// //     const quillRef = useRef();

// //     useEffect(() => {
// //         if (quillRef.current) {
// //             const quill = quillRef.current.getEditor();
// //             if (quill) {
// //                 // Register custom image handler module
// //                 const imageHandler = () => {
// //                     const input = document.createElement('input');
// //                     input.setAttribute('type', 'file');
// //                     input.setAttribute('accept', 'image/*');
// //                     input.setAttribute('multiple', false);
// //                     input.click();
// //                     input.onchange = () => {
// //                         const file = input.files[0];
// //                         if (file) {
// //                             const formData = new FormData();
// //                             formData.append('image', file);
// //                             uploadImage(formData);
// //                         }
// //                     };
// //                 };
// //                 quill.getModule('toolbar').addHandler('image', imageHandler);
// //             }
// //         }
// //     }, [quillRef]);

// //    const uploadImage = async (formData) => {
// //     try {
// //         // Replace 'your-upload-api-endpoint' with your actual backend API endpoint for image upload
// //         const response = await fetch('your-upload-api-endpoint', {
// //             method: 'POST',
// //             body: formData,
// //         });
// //         if (!response.ok) {
// //             throw new Error('Failed to upload image');
// //         }
// //         const data = await response.json();
// //         if (!data || !data.imageUrl) {
// //             throw new Error('Invalid response from server');
// //         }
// //         const imageUrl = data.imageUrl; // Adjust this according to your backend response structure
// //         insertImage(imageUrl);
// //     } catch (error) {
// //         console.error('Error uploading image:', error);
// //     }
// // };
// //     const insertImage = (imageUrl) => {
// //         const quill = quillRef.current.getEditor();
// //         const cursorPosition = quill.getSelection(true).index;
// //         quill.insertEmbed(cursorPosition, 'image', imageUrl);
// //     };

// //     return (
// //         <div className="mx-auto max-w-4xl p-4">
// //             <ReactQuill
// //                 ref={quillRef}
// //                 value={editorValue}
// //                 onChange={setEditorValue}
// //                 className="h-64 border rounded-lg shadow-lg"
// //                 modules={{
// //                     toolbar: {
// //                         container: [
// //                             [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
// //                             [{size: []}],
// //                             ['bold', 'italic', 'underline', 'strike', 'blockquote'],
// //                             [{'list': 'ordered'}, {'list': 'bullet'},
// //                             {'indent': '-1'}, {'indent': '+1'}],
// //                             ['link', 'image', 'video'],
// //                             ['clean']
// //                         ]
// //                     },
// //                     clipboard: {
// //                         matchVisual: false, // Needed to properly paste images
// //                     }
// //                 }}
// //             />
// //         </div>
// //     );
// // }

// // export default Editor;

// import React, { useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Import Quill styles

// const Editor = () => {
//   const [title, setTitle] = useState('');
//   const [body, setBody] = useState('');
//   const fontOptions = [
//     'Arial',
//     'Helvetica',
//     'Times New Roman',
//     'Courier New',
//     'Verdana',
//     'Georgia',
//     'Palatino',
//     'Garamond',
//     'Bookman',
//     'Comic Sans MS',
//     'Trebuchet MS',
//     'Arial Black',
//     'Impact'
//   ];
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, false] }],
//       ['bold', 'italic', 'underline'],
//       ['link', 'image'],
//       [{ list: 'ordered' }, { list: 'bullet' }],
//       [{ indent: '-1' }, { indent: '+1' }],
//       ['clean'],
//       [{ font: [fontOptions] }]
//     ],
//   };

//   const formats = [
//     'header',
//     'bold',
//     'italic',
//     'underline',
//     'link',
//     'image',
//     'list',
//     'indent',
//   ];

//   const handleBodyChange = (value) => {
//     setBody(value);
//   };

//   return (
//     <form className="w-full max-w-4xl mx-auto p-4">
//       <div className="mb-4">
//         <label htmlFor="body" className="block text-sm font-medium text-gray-700">
//           Body
//         </label>
//         <div className="mt-1">
//           <ReactQuill
//             id="body"
//             modules={modules}
//             formats={formats}
//             value={body}
//             onChange={handleBodyChange}
//             className="h-64 border rounded-lg shadow-lg font-serif" // Add font type here
//           />
//         </div>
//       </div>
//     </form>
//   );
// };

// export default Editor;
