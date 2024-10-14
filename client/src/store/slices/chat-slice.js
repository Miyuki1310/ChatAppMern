export const createChatSlice = (set, get) => {
  return {
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessageContacts: [],
    isUploading: false,
    isDownloading: false,
    fileDownloadProgress: 0,
    fileUploadProgress: 0,
    channels: [],
    setChannels: (channels) => set({ channels }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileDownloadProgress: (fileDownloadProgress) =>
      set({ fileDownloadProgress }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setDirectMessageContacts: (directMessageContacts) =>
      set({ directMessageContacts }),
    setSelectedChatMessages: (selectedChatMessages) =>
      set({ selectedChatMessages }),
    addChannel: (channel) => {
      const channels = get().channels;
      set({ channels: [...channels, channel] });
    },
    closeChat: () =>
      set({
        selectedChatData: undefined,
        selectedChatType: undefined,
        selectedChatMessages: [],
      }),
    addMessage: (message) => {
      const selectedChatMessages = get().selectedChatMessages;
      const selectedChatType = get().selectedChatType;

      set({
        selectedChatMessages: [
          ...selectedChatMessages,
          {
            ...message,
            recipient:
              selectedChatType === "channel"
                ? message.recipient
                : message.recipient._id,
            sender:
              selectedChatType === "channel"
                ? message.sender
                : message.sender._id,
          },
        ],
      });
    },

    addChannelInChannelList: (message) => {
      const channels = get().channels;
      const data = channels.find(
        (channel) => channel._id === message.channelId
      );
      const index = channels.findIndex(
        (channel) => channel._id === message.channelId
      );
      if (index !== -1 && index !== undefined) {
        channels.splice(index, 1);
        channels.unshift(data);
      }
    },
  };
};
