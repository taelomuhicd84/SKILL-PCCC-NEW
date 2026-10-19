import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
export const moPdf = (data: ArrayBuffer) => pdfjs.getDocument({ data: new Uint8Array(data.slice(0)) }).promise;
export type PdfDoc = Awaited<ReturnType<typeof moPdf>>;
