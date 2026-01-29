import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportPdf(previewElement: HTMLDivElement): Promise<void> {
  const svgElement = previewElement.querySelector('svg');
  if (!svgElement) return;

  const canvas = await html2canvas(previewElement, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width / 2;
  const imgHeight = canvas.height / 2;

  const isLandscape = imgWidth > imgHeight;
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;

  const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
  const finalWidth = imgWidth * ratio;
  const finalHeight = imgHeight * ratio;

  const x = (pageWidth - finalWidth) / 2;
  const y = (pageHeight - finalHeight) / 2;

  pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
  pdf.save('mermaid-diagram.pdf');
}
