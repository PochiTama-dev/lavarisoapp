import React, { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/";
import pdfjsWorker from "pdfjs-dist";
import { IonContent } from "@ionic/react";

interface PdfViewerProps {
  url: string | null;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (!url || !canvasRef.current) return;

      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1 });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      }
    };

    loadPdf();
  }, [url]);

  return (
    <IonContent>
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
    </IonContent>
  );
};

export default PdfViewer;
