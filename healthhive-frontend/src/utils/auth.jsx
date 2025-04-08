import { currentUser } from "../services/apiService";

export const fetchCurrentUser = async () => {
  try {
    const res = await currentUser();
    return res;
  } catch (err) {
    return null;
  }
};
