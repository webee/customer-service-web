export const LabelType = {
  self: "self",
  member: "self.",
  self_plus: "self+"
};

export function targetMatchContextLabel(target, uid, t, label) {
  if (label === null) {
    return false;
  }

  switch (t) {
    case LabelType.self:
      return (label + "=" + uid).startsWith(target);
    case LabelType.self_plus:
      return (label + "=" + uid).startsWith(target) || (label + ":" + uid).startsWith(target);
    case LabelType.member:
      return (label + ":" + uid).startsWith(target);
    default:
      return false;
  }
}

export function targetMatchContextLabels(target, uid, context_labels) {
  for (const [t, label] of context_labels) {
    if (targetMatchContextLabel(target, uid, t, label)) {
      return true;
    }
  }
  return false;
}

export function targetsMatchContextLabels(targets, uid, context_labels) {
  for (const target of targets) {
    if (targetMatchContextLabels(target, uid, context_labels)) {
      return true;
    }
  }
  return false;
}

export function getContextLabelTargets(uid, [type, label]) {
  switch (type) {
    case LabelType.self:
      return [label, label + "=" + uid];
    case LabelType.self_plus:
      return [label, label + "=" + uid, label + ":" + uid];
    case LabelType.member:
      return [label + ":" + uid];
    default:
      return [];
  }
}

export function getTargets(uid, context_labels) {
  const targets = [];
  for (const context_label of context_labels) {
    targets.push(...getContextLabelTargets(uid, context_label));
  }
  return targets;
}

export function pathIsStaffOfContextLabels(path, context_labels) {
  for (const [_, label] of context_labels) {
    if (path === label) {
      return true;
    }
  }
  return false;
}

export function getContextLabelStaffsOfPath(path, t, label) {
  if (label !== path) {
    return [];
  }

  switch (t) {
    case LabelType.self:
      return ["="];
    case LabelType.self_plus:
      return ["=", ":"];
    case LabelType.member:
      return [":"];
    default:
      return [];
  }
}

export function getContextLabelsStaffsOfPath(path, context_labels) {
  const staffs = [];
  for (const [t, label] of context_labels) {
    staffs.push(...getContextLabelStaffsOfPath(path, t, label));
  }
  return staffs;
}

export function contextLabelMatchContextLabels(uid1, context_label1, uid2, context_labels2) {
  for (const target of getContextLabelTargets(uid1, context_label1)) {
    if (targetMatchContextLabels(target, uid2, context_labels2)) {
      return true;
    }
  }
  return false;
}

export function contextLabelsMatchContextLabels(uid1, context_labels1, uid2, context_labels2) {
  for (const target of getTargets(uid1, context_labels1)) {
    if (targetMatchContextLabels(target, uid2, context_labels2)) {
      return true;
    }
  }
  return false;
}
