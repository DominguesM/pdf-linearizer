import React, { useState } from "react";

const UploadForm = ({ onUpload }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                setError("Por favor, selecione apenas arquivos PDF.");
                return;
            }

            setUploading(true);
            setError(null);
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("http://localhost:8000/upload", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    onUpload();
                } else {
                    throw new Error("Erro ao fazer upload do arquivo");
                }
            } catch (error) {
                setError(
                    "Ocorreu um erro ao fazer upload do arquivo. Tente novamente.",
                );
                console.error("Erro:", error);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
                <label
                    htmlFor="file-upload"
                    className={`inline-block cursor-pointer ${
                        uploading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:text-blue-500"
                    }`}
                >
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="space-y-1">
                            <span className="block text-sm font-medium text-gray-700">
                                {uploading
                                    ? "Enviando..."
                                    : "Selecione um arquivo"}
                            </span>
                            <span className="block text-xs text-gray-500">
                                {' '}PDF de até 50MB
                            </span>
                        </div>
                    </div>
                    <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            </div>
            {error && (
                <div className="mt-2 text-center text-xs text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
};

export default UploadForm;
