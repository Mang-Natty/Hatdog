import ApiManager from "./ApiManager";

export const user_login = async (data) => {
  try {
    const result = await ApiManager("/user/login", data, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
    return result.data;
  } catch (err) {
    return { success: false, message: err.response?.message || err.message };
  }
};
