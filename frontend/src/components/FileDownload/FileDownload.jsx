import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../FileDownload/styles.module.css";

const FileList = ({ onFileUpload }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [code, setCode] = useState(""); 
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [message, setMessage] = useState(""); 

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8080/api/files/list", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setFiles(response.data);
      } catch (error) {
        setError("Failed to load files");
      }
    };

    fetchFiles();
  }, []);

  // Handle code validation and download
  const handleDownload = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      
      const validationResponse = await axios.post(
        `http://localhost:8080/api/files/validate-code/${fileId}`,
        { code }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", 
        }
      );
      
      if (validationResponse.status === 200) {
        const url = window.URL.createObjectURL(new Blob([validationResponse.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", files.find(file => file._id === fileId).originalName); 
        document.body.appendChild(link);
        link.click();
        link.remove();

        setMessage("File downloaded successfully!");
      } else {
        setError("Invalid code. Please try again.");
      }
    } catch (error) {
      setError("Code validation failed.");
      console.error("Download error:", error);
    }
  };

  const handleDownloadClick = (fileId) => {
    setSelectedFileId(fileId); 
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (selectedFileId) {
      handleDownload(selectedFileId); 
    }
  };

  useEffect(()=>{
    
  })

  const handleDelete = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/files/delete/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles(files.filter((file) => file._id !== fileId));
    } catch (error) {
      setError("Failed to delete file");
    }
  };


  return (
    <div className={styles.file_list_container}>
      <h2>Your Uploaded Files</h2>
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <table className={styles.file_table}>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Download</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file._id}>
                <td>{file.originalName}</td>
                <td>
                  <button
                    onClick={() => handleDownloadClick(file._id)}
                    className={styles.download_btn}
                  >
                    Download
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(file._id)} className={styles.delete_btn}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedFileId && (
        <form onSubmit={handleCodeSubmit} className={styles.code_form}>
          <h3>Enter the 6-digit code to download the file:</h3>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="Enter code"
          />
          <button type="submit" className={styles.submit_btn}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default FileList;
