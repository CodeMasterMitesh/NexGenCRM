export const getUserScope = (req, assignedField = "assignedTo") => {
  const isAdmin = req.user?.role === "Admin";
  const userId = String(req.user?.sub || "").trim();
  const userName = String(req.user?.name || "").trim();

  if (isAdmin) {
    return { isAdmin: true, orFilters: [] };
  }

  const values = [userId, userName].filter(Boolean);
  if (!values.length) {
    return { isAdmin: false, orFilters: [{ [assignedField]: "__NO_MATCH__" }] };
  }

  return {
    isAdmin: false,
    orFilters: values.map((value) => ({ [assignedField]: value })),
  };
};

export const buildRoleFilter = (req, baseFilter = {}, assignedField = "assignedTo") => {
  const scope = getUserScope(req, assignedField);
  if (scope.isAdmin) {
    return { ...baseFilter };
  }
  return {
    ...baseFilter,
    $or: scope.orFilters,
  };
};

export const isAssignedToUser = (assignedValue, req) => {
  if (req.user?.role === "Admin") return true;
  const values = [String(req.user?.sub || "").trim(), String(req.user?.name || "").trim()].filter(Boolean);
  return values.includes(String(assignedValue || "").trim());
};
