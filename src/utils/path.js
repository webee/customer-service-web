export function getFilenameExt(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function splitFileNameAndExt(name, backSize = 0) {
  const ext = getFilenameExt(name);
  if (ext) {
    const startIndex = name.length - ext.length - 1;
    const extPart = startIndex >= backSize ? name.substring(startIndex - backSize) : name;
    const namePart = name.substr(0, name.length - extPart.length);
    return [namePart, extPart, ext.toLowerCase()];
  }
  return [name, "", ""];
}
