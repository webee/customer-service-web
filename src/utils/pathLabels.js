export const LabelType = {
  self: "self",
  member: "self.",
  self_plus: "self+"
};

export function pathMatchContextLabel(path, uid, t, label) {
  if (label === null) {
    return false;
  }

  switch (t) {
    case LabelType.self:
    case LabelType.self_plus:
      return label.startsWith(path);
    case LabelType.member:
      return (label + ":" + uid).startsWith(path);
    default:
      return false;
  }
}

export function pathMatchContextLabels(path, uid, context_labels) {
  for (const [t, label] of context_labels) {
    if (pathMatchContextLabel(path, uid, t, label)) {
      return true;
    }
  }
  return false;
}

export function pathIsSelfOfContextLabel(path, uid, t, label) {
  if (label === null) {
    return false;
  }

  switch (t) {
    case LabelType.self_plus:
    case LabelType.member:
      return label === path;
    case LabelType.self:
    default:
      return false;
  }
}

export function pathIsSelfOfContextLabels(path, uid, context_labels) {
  for (const [t, label] of context_labels) {
    if (pathIsSelfOfContextLabel(path, uid, t, label)) {
      return true;
    }
  }
  return false;
}

export function contextLabelMatchContextLabels(uid1, context_label, uid2, context_labels) {
  const [t, path] = context_label;
  switch (t) {
    case LabelType.self:
    case LabelType.self_plus:
      return pathMatchContextLabels(path, uid2, context_labels);
    case LabelType.member:
      return pathMatchContextLabels(path + ":" + uid1, uid2, context_labels);
    default:
      return false;
  }
}

export function contextLabelsMatchContextLabels(uid1, context_labels1, uid2, context_labels2) {
  for (const context_label of context_labels1) {
    if (contextLabelMatchContextLabels(uid1, context_label, uid2, context_labels2)) {
      return true;
    }
  }
  return false;
}
