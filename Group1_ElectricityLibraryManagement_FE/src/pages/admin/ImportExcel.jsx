import React, { useState } from "react";
import axios from "axios";
import axiosClient from "../../api/axiosClient";

const ImportExcel = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Chọn file trước!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosClient.post("/api/v1/accounts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Import thành công!");
    } catch (error) {
      console.error("Import error:", error.response || error.message);
      alert("Import thất bại: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h3>Import Reader Accounts</h3>
      <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Tải lên</button>
    </div>
  );
}
export default ImportExcel