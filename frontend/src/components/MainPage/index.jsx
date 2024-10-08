import styles from "./styles.module.css";
import Upload from '../FileUpload/FileUpload'
import FileDownload from "../FileDownload/FileDownload"
 
const Main = () => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>Mobigic</h1>

        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
        {/* <button className={styles.white_btn} onClick={handleNavigate}>
          Upload
        </button> */}
      </nav>

      <Upload />
      <FileDownload />
  
    </div>
  );
};

export default Main;
