import api from "../utils/axiosConfig";

// Authentication
export const login = (credentials) =>
  api.post("auth/login", credentials, { withCredentials: true });

export const currentUser = async () => {
  try {
    const res = await api.get("auth/me", { withCredentials: true });
    return res.data;
  } catch {
    return null;
  }
};

export const logoutUser = async () => {
  return api.post("/auth/logout", {}, { withCredentials: true });
};

export const registerUser = async (user) => {
  return api.post("/users/register", user, { withCredentials: true });
};

// Health Data
export const fetchHealthData = (userId) => {
  return api.get(`/health/${userId}`);
};

export const logHealthData = (data) => {
  return api.post("/health/log", data);
};

export const updateHealthLog = (logId, data) =>
  api.put(`/health/${logId}`, data);

export const deleteHealthLog = (logId) => api.delete(`/health/${logId}`);

export const fetchDailySummaries = (userId) =>
  api.get(`/health/summary/${userId}`);

// Insights
export const fetchInsights = () => {
  return api.get("/insights");
};

export const fetchPersonalInsights = (userId) => {
  return api.get(`/insights/personal/${userId}`);
};

// Health Resources
export const fetchAllResources = () => api.get("/resources");

export const fetchResources = (category) => {
  const url = category ? `/resources/${category}` : "/resources";
  return api.get(url);
};

export const addResource = (resource) => {
  return api.post("/resources", resource);
};

// Emergency Contacts
export const getEmergencyContacts = (username) => {
  return api.get(`/emergency-contacts/${username}`);
};

export const addEmergencyContact = (contact) => {
  return api.post("/emergency-contacts", contact);
};

// Mental Health Messages
export const fetchMentalMessages = () => {
  return api.get("/mental-messages");
};

export const postMentalMessage = (content) => {
  return api.post("/mental-messages", { content });
};

export const reactToMentalMessage = (messageId, type) => {
  return api.post(`/mental-messages/${messageId}/react`, null, {
    params: { type },
  });
};

// Appointments
export const fetchAppointments = (userId) => {
  return api.get(`/appointments/${userId}`);
};

export const bookAppointment = (appointment) =>
  api.post("/appointments", appointment);

// Volunteer Opportunities
export const fetchVolunteerOpportunities = () => {
  return api.get("volunteer");
};

export const createVolunteerOpportunity = (data) => {
  return api.post("volunteer", data);
};

export const joinVolunteerOpportunity = (opportunityId, userId) => {
  return api.post(`/volunteer/${opportunityId}/join`, null, {
    params: { userId },
  });
};

export const fetchJoinedOpportunityIds = (userId) => {
  return api.get(`/volunteer/joined/${userId}`);
};

// Challenges
export const fetchAllChallenges = () => api.get("/challenges");

export const fetchMyChallenges = (userId) =>
  api.get(`/challenges/my/${userId}`);

export const createChallenge = (challenge) =>
  api.post("/challenges", challenge);

export const joinChallenge = (challengeId, userId) =>
  api.post(`/challenges/${challengeId}/join`, null, { params: { userId } });

export const cancelJoinChallenge = (id, userId) =>
  api.post(`/challenges/${id}/cancel`, null, { params: { userId } });

export const fetchChallengeProgress = (userId) =>
  api.get(`/challenges/progress/${userId}`);

export const fetchAllChallengeStats = () => {
  return api.get("/challenges/stats/all");
};

// Notifications
export const fetchNotifications = async () => {
  const res = await api.get("notifications");
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  await api.put(`notifications/${id}/read`);
};

export const markAllNotificationsRead = async () => {
  await api.put("notifications/mark-all-read");
};
