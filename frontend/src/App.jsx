import React, { useState, useEffect } from "react";
import FileList from "./components/FileList";
import PDFViewer from "./components/PDFViewer";
import UploadForm from "./components/UploadForm";
import "./tailwind.css";

function App() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchFiles = async () => {
        try {
            const response = await fetch("http://localhost:8000/files");
            const data = await response.json();
            setFiles(data);
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleViewFile = (filename) => {
        setSelectedFile(`http://localhost:8000/pdf/${filename}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        PDF Linearization Demo
                    </h1>
                    <p className="text-gray-600">
                        Upload, linearize e visualize seus PDFs de forma otimizada
                    </p>
                </header>

                <main className="card p-6">
                    <UploadForm onUpload={fetchFiles} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                        <section className="bg-gray-50 rounded-lg p-4">
                            <FileList
                                files={files}
                                onViewFile={handleViewFile}
                            />
                        </section>
                        <section className="bg-gray-50 rounded-lg p-4">
                            {selectedFile ? (
                                <PDFViewer file={selectedFile} />
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>Selecione um arquivo para visualizar</p>
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;