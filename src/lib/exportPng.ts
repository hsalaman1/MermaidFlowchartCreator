import html2canvas from 'html2canvas';

export async function exportPng(previewElement: HTMLDivElement): Promise<void> {
  const svgElement = previewElement.querySelector('svg');
  if (!svgElement) return;

  const canvas = await html2canvas(previewElement, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  });

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mermaid-diagram.png';
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
