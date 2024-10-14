export const createAuthSlice = (set) => {
  return {
    userInfo: undefined,
    setUserInfo: (userInfo) => set({ userInfo }),
  };
};
