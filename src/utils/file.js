export async function getImageFileDimension(file) {
  return new Promise((resolve, rejejct) => {
    const img = document.createElement("img");
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      resolve({ width, height });
    };
    img.onerror = err => {
      rejejct(err);
    };
    img.src = URL.createObjectURL(file);
  });
}
