from pathlib import Path
from typing import Optional

import pikepdf
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "range"],
    expose_headers=["Content-Range", "Accept-Ranges", "Content-Length", "Content-Type"],
)

PDF_DIR = Path("/pdf_storage")
PDF_DIR.mkdir(exist_ok=True)

CHUNK_SIZE = 8192  # 8KB chunks


def stream_file(file_path: Path, start: int = 0, end: Optional[int] = None):
    with open(file_path, "rb") as f:
        f.seek(start)
        while True:
            max_bytes = CHUNK_SIZE if end is None else min(CHUNK_SIZE, end - start + 1)
            if max_bytes <= 0:
                break

            chunk = f.read(max_bytes)
            if not chunk:
                break

            yield chunk
            start += len(chunk)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        original_filename = f"original_{file.filename}"
        original_path = PDF_DIR / original_filename

        with open(original_path, "wb") as f:
            content = await file.read()
            f.write(content)

        linear_filename = f"linear_{file.filename}"
        linear_path = PDF_DIR / linear_filename

        with pikepdf.open(original_path) as pdf:
            pdf.save(
                linear_path,
                linearize=True,
                object_stream_mode=pikepdf.ObjectStreamMode.generate,
                compress_streams=True,
                stream_decode_level=pikepdf.StreamDecodeLevel.none,
                recompress_flate=True,
                preserve_pdfa=True,
            )

            with pikepdf.open(linear_path) as check_pdf:
                if not check_pdf.is_linearized:
                    raise HTTPException(
                        status_code=500, detail="PDF linearization failed"
                    )

        return {"filename": linear_filename, "original_filename": original_filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@app.get("/files")
async def list_files():
    files = []
    for file in PDF_DIR.glob("*.pdf"):
        file_info = {
            "name": file.name,
            "size": file.stat().st_size,
            "created": file.stat().st_ctime,
            "is_linear": file.name.startswith("linear_"),
            "pair_name": f"{'original' if file.name.startswith('linear_') else 'linear'}_{file.name.split('_', 1)[1]}",
        }
        files.append(file_info)
    return files


@app.get("/pdf/{filename}")
async def get_pdf(filename: str, request: Request):
    file_path = PDF_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    try:
        with pikepdf.open(file_path) as pdf:
            file_size = file_path.stat().st_size
            is_linear = pdf.is_linearized

        headers = {
            "Accept-Ranges": "bytes",
            "Content-Type": "application/pdf",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        }

        range_header = request.headers.get("range")

        if range_header and is_linear:
            try:
                range_str = range_header.replace("bytes=", "")
                start_str, end_str = range_str.split("-")
                start = int(start_str) if start_str else 0
                end = int(end_str) if end_str else file_size - 1

                start = max(0, start)
                end = min(file_size - 1, end)
                content_length = end - start + 1

                headers.update(
                    {
                        "Content-Length": str(content_length),
                        "Content-Range": f"bytes {start}-{end}/{file_size}",
                    }
                )

                return StreamingResponse(
                    stream_file(file_path, start, end),
                    status_code=206,
                    headers=headers,
                    media_type="application/pdf",
                )

            except ValueError:
                pass

        headers["Content-Length"] = str(file_size)
        return StreamingResponse(
            stream_file(file_path), headers=headers, media_type="application/pdf"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
