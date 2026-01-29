export async function exportPng(previewElement: HTMLDivElement): Promise<void> {
  const svgElement = previewElement.querySelector('svg');
  if (!svgElement) return;

  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

  // Ensure the SVG has explicit dimensions
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

      canvas.toBlob((blob) => {
        if (!blob) {
          resolve();
          return;
        }
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'mermaid-diagram.png';
        a.click();
        URL.revokeObjectURL(downloadUrl);
        resolve();
      }, 'image/png');

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve();
    };

    img.src = url;
  });
}
