let chats = {};
// { chatId: [{ role: "user" | "assistant", content: "..." }] }

export function createChat() {
  const id = Date.now().toString();
  chats[id] = [];
  return id;
}

export function getChat(id) {
  return chats[id] || [];
}

export function addMessage(chatId, message) {
  if (!chats[chatId]) chats[chatId] = [];
  chats[chatId].push(message);
}

export function getAllChats() {
  return Object.keys(chats);
}
