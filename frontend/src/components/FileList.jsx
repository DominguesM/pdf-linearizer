import React from "react";

const FileList = ({ files, onViewFile }) => {
    // Agrupa os arquivos por nome base (removendo prefixos linear_ e original_)
    const groupedFiles = files.reduce((acc, file) => {
        const baseName = file.name.split("_", 2)[1];
        if (!acc[baseName]) {
            acc[baseName] = {};
        }
        acc[baseName][file.name.startsWith("linear_") ? "linear" : "original"] =
            file;
        return acc;
    }, {});

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Arquivos PDF
            </h2>
            {Object.entries(groupedFiles).length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg border-2 border-dashed">
                    <p>Nenhum arquivo encontrado</p>
                    <p className="text-sm mt-2">
                        Faça upload de um PDF para começar
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {Object.entries(groupedFiles).map(
                        ([baseName, versions]) => (
                            <div
                                key={baseName}
                                className="bg-white rounded-lg p-4 shadow-sm"
                            >
                                <h3 className="font-medium text-gray-900 mb-2">
                                    {baseName}
                                </h3>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() =>
                                            onViewFile(versions.original?.name)
                                        }
                                        className="px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-md
                           hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500
                           transition-colors duration-200"
                                    >
                                        Ver Original
                                    </button>
                                    <button
                                        onClick={() =>
                                            onViewFile(versions.linear?.name)
                                        }
                                        className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md
                           hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                           transition-colors duration-200"
                                    >
                                        Ver Linearizado
                                    </button>
                                </div>
                            </div>
                        ),
                    )}
                </div>
            )}
        </div>
    );
};

export default FileList;
