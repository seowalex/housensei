import { ChatWidget } from '@papercups-io/chat-widget';

const ChatBot = () => (
  <ChatWidget
    token={import.meta.env.VITE_CHAT_TOKEN}
    title="Welcome to Housensei!"
    subtitle="Feel free to provide any feedback you have 😊"
    greeting="Hello! Thank you for visiting Housensei! How do you find Housensei so far? Any feedback is greatly appreciated :)"
    popUpInitialMessage
  />
);

export default ChatBot;
