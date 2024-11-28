import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const PDFViewer = ({ file }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [metrics, setMetrics] = useState({
        firstPage: null,
        fullLoad: null
    });
    const startTimeRef = useRef(Date.now());
    const firstPageShownRef = useRef(false);
    const [key, setKey] = useState(0);
    const [error, setError] = useState(null);

    const isLinear = file?.includes("linear_");
    const headerClass = isLinear ? "bg-blue-50" : "bg-orange-50";
    const textClass = isLinear ? "text-blue-700" : "text-orange-700";

    useEffect(() => {
        if (file) {
            setNumPages(null);
            setPageNumber(1);
            setLoadingProgress(0);
            startTimeRef.current = Date.now();
            firstPageShownRef.current = false;
            setMetrics({ firstPage: null, fullLoad: null });
            setError(null);
            setKey(prev => prev + 1);
        }
    }, [file]);

    const options = useMemo(() => ({
        cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
        cMapPacked: true,
        standardFontDataUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/",
        disableRange: !isLinear,
        disableStream: !isLinear,
        disableAutoFetch: !isLinear,
        disableCreateObjectURL: true,
        rangeChunkSize: 32768, // 32KB chunks
    }), [isLinear]);

    const onDocumentLoadProgress = useCallback(({ loaded, total }) => {
        if (total > 0) {
            const progress = Math.min((loaded / total) * 100, 100);
            setLoadingProgress(Math.round(progress));

            if (progress === 100) {
                const loadTime = (Date.now() - startTimeRef.current) / 1000;
                setMetrics(prev => ({
                    ...prev,
                    fullLoad: loadTime
                }));
            }
        }
    }, []);

    const onDocumentLoadError = useCallback((error) => {
        console.error('Error loading PDF:', error);
        setError(error.message);
    }, []);

    const onPageRenderSuccess = useCallback(() => {
        if (!firstPageShownRef.current) {
            firstPageShownRef.current = true;
            const renderTime = (Date.now() - startTimeRef.current) / 1000;
            setMetrics(prev => ({
                ...prev,
                firstPage: renderTime
            }));
        }
    }, []);

    const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }) => {
        setNumPages(nextNumPages);
    }, []);

    useEffect(() => {
        if (error && isLinear) {
            console.log('Retrying without streaming...');
            setKey(prev => prev + 1);
        }
    }, [error, isLinear]);

    return (
        <div className="mt-4">
            <div className={`p-3 ${headerClass} rounded-lg mb-4`}>
                <p className={`text-sm font-medium ${textClass}`}>
                    Visualizando versão {isLinear ? "linearizada" : "original"}
                </p>
            </div>
            
            {loadingProgress < 100 && !error && (
                <div className="mb-4">
                    <div className="h-2 w-full bg-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        Download: {loadingProgress}%
                    </p>
                </div>
            )}

            {!error && <div className="space-y-2 mb-4">
                {metrics.firstPage !== null && (
                    <div className={`p-3 ${isLinear ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'} border rounded-lg`}>
                        <p className={`text-sm ${isLinear ? 'text-green-700' : 'text-orange-700'} text-center font-medium`}>
                            Primeira página carregada em {metrics.firstPage.toFixed(2)} segundos
                        </p>
                    </div>
                )}
                
                {metrics.fullLoad !== null && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700 text-center font-medium">
                            PDF completo carregado em {metrics.fullLoad.toFixed(2)} segundos
                        </p>
                    </div>
                )}
            </div>}

            <div className="bg-white rounded-lg shadow-sm p-4">
                {file && (
                    <Document
                        key={key}
                        file={file}
                        onLoadProgress={onDocumentLoadProgress}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        options={options}
                        loading={
                            <div className="text-center py-8 text-gray-500">
                                <p>Carregando PDF...</p>
                            </div>
                        }
                        error={
                            <div className="text-center py-8 text-red-500">
                                <p>Erro ao carregar o PDF. Tentando novamente...</p>
                            </div>
                        }
                    >
                        {!error && <Page
                            pageNumber={pageNumber}
                            onRenderSuccess={onPageRenderSuccess}
                            loading={
                                <div className="text-center py-4 text-gray-500">
                                    <p>Carregando página...</p>
                                </div>
                            }
                            error={
                                <div className="text-center py-4 text-red-500">
                                    <p>Erro ao carregar página</p>
                                </div>
                            }
                            width={600}
                            className="max-w-full mx-auto"
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />}
                    </Document>
                )}

                {!error && numPages && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            Página {pageNumber} de {numPages}
                        </p>
                        <div className="space-x-2">
                            <button
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md
                                    hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Anterior
                            </button>
                            <button
                                disabled={pageNumber >= numPages}
                                onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                                className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md
                                    hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;