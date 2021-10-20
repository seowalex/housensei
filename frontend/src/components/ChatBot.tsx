import { ChatWidget } from '@papercups-io/chat-widget';

const ChatBot = () => {
  const GREETING =
    'Hello! Thank you for visiting Housensei! How do you find Housensei so far? Any feedback is greatly appreciated :)';
  const TITLE = 'Welcome to Housensei';
  const SUBTITILE = 'Feel free to provide any feedback you have 😊';

  return (
    <ChatWidget
      token={import.meta.env.VITE_CHAT_TOKEN}
      inbox="e1b231f1-e569-49ae-ae10-de77578a5d7c"
      title={TITLE}
      subtitle={SUBTITILE}
      primaryColor="#1890ff"
      greeting={GREETING}
      newMessagePlaceholder="Start typing..."
      showAgentAvailability={false}
      agentAvailableText="We're online right now!"
      agentUnavailableText="We're away at the moment."
      requireEmailUpfront={false}
      iconVariant="outlined"
      baseUrl="https://app.papercups.io"
    />
  );
};

export default ChatBot;
