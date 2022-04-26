import { getLastMessage } from './index'

getLastMessage().then((message) => {
  if (message) {
    console.log(`Last message from ${message.chat.first_name}, chat id: ${message.chat.id}`);
  } else {
    console.log(`No messages`);
  }
})
