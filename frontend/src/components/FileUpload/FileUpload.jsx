import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = "http://localhost:8080/api/files/upload";
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage(`File uploaded successfully! Your code is: ${response.data.code}`);
      setMessageType("success");
    } catch (error) {
      setMessage("File upload failed: " + (error.response ? error.response.data.message : error.message));
      setMessageType("error");
    }
  };

  return (
    <div className={styles.upload_container}>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>
      {message && <p className={styles[messageType]}>{message}</p>}
    </div>
  );
};

export default FileUpload;
