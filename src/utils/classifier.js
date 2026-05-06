export const CLASSIFICATION_TYPES = {
  'HARDWARE ONLY': { label: 'Hardware Only', color: '#d97706' },
  'HARDWARE + FIRMWARE': { label: 'Hardware + Firmware', color: '#7c3aed' },
  'HARDWARE + FIRMWARE + SOFTWARE': { label: 'Hardware + Firmware + Software', color: '#2563eb' },
  'FIRMWARE + SOFTWARE': { label: 'Firmware + Software', color: '#059669' },
  'SOFTWARE ONLY': { label: 'Software Only', color: '#0891b2' },
};

export function getClassificationMeta(classificationString) {
  return CLASSIFICATION_TYPES[classificationString] || { label: classificationString, color: '#8b92a5' };
}
