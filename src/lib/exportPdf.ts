import jsPDF from 'jspdf';

export async function exportPdf(previewElement: HTMLDivElement): Promise<void> {
  const svgElement = previewElement.querySelector('svg');
  if (!svgElement) return;

  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

  const bbox = svgElement.getBoundingClientRect();
  clonedSvg.setAttribute('width', String(bbox.width));
  clonedSvg.setAttribute('height', String(bbox.height));

  const svgData = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  const scale = 2;

  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = bbox.width * scale;
      canvas.height = bbox.height * scale;

      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = bbox.width;
      const imgHeight = bbox.height;

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

      URL.revokeObjectURL(url);
      resolve();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve();
    };

    img.src = url;
  });
}
