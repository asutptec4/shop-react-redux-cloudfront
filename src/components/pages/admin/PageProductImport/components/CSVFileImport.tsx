import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios, { AxiosError } from "axios";
import useNotification from "~/components/NotificationProvider/useNotification";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const { setNotification } = useNotification();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    if (file) {
      // Get the presigned URL
      console.log("File to upload: ", file.name);
      try {
        const response = await axios({
          method: "GET",
          url,
          headers: {
            Authorization: `Basic ${localStorage.getItem(
              "authorization_token"
            )}`,
          },
          params: {
            fileName: encodeURIComponent(file.name),
          },
        });
        console.log("Uploading to: ", response.data);
        const result = await fetch(response.data, {
          method: "PUT",
          body: file,
        });
        console.log("Result: ", result);
        setFile(undefined);
      } catch (e: unknown) {
        setNotification({
          isOpen: true,
          message: (e as AxiosError).message,
          type: "error",
        });
      }
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
