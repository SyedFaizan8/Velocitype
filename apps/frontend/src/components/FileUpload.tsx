"use client";

import { forwardRef } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    setUploading: (uploading: boolean) => void;
    setError: (error: string | null) => void;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
    ({ onSuccess, setUploading, setError }, ref) => {

        const handleSuccess = (response: IKUploadResponse) => {
            setUploading(false);
            setError(null);
            onSuccess(response);
        };

        const validateFile = (file: File) => {
            if (!file.type.startsWith("image/")) {
                setError("Please upload a valid image");
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Image must be less than 5MB");
                return false;
            }
            return true;
        };

        return (
            <IKUpload
                fileName="dp"
                useUniqueFileName
                validateFile={validateFile}
                onError={(err) => {
                    setError(err.message);
                    setUploading(false);
                }}
                onSuccess={handleSuccess}
                onUploadStart={() => {
                    setUploading(true);
                    setError(null);
                }}
                folder="/velocitype_users_dp"
                ref={ref}
                style={{ display: "none" }}
            />
        );
    }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
