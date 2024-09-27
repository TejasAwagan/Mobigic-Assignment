import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";  

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");


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

  return (
    <div className={styles.file_list_container}>
      <h2>Your Uploaded Files</h2>
      {error && <p className={styles.error}>{error}</p>}
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
                  <a href={`http://localhost:8080/api/files/download/${file._id}`} target="_blank" rel="noopener noreferrer" className={styles.download_link}>
                    Download
                  </a>
                </td>
                <td>
                  <button className={styles.delete_btn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FileList;
