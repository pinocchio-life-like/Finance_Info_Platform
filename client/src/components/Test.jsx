import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    try {
      // Get the pre-signed URL from our API
      const response = await axios.get('http://localhost:5000/upload');
      const presignedUrl = response.data.presignedUrl;

      // Upload the file using the pre-signed URL
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });

      alert('File uploaded successfully.');
    } catch (error) {
      console.error('An error occurred while uploading the file:', error);
      alert('File upload failed.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to S3</button>
    </div>
  );
};

export default FileUpload;
