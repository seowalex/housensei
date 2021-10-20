import { ChatWidget } from '@papercups-io/chat-widget';

const ChatBot = () => {
  const GREETING =
    "Hello! Thank you for trying out Housensei! What do you like or don't like about Housensei? Any feedback is greatly appreciated :)";
  const TITLE = 'Welcome to Housensei';
  const SUBTITILE = 'Feel free to provide any feedback you have 😊';

  return (
    <ChatWidget
      token={process.env.CHAT_TOKEN ?? ''}
      inbox={process.env.CHAT_INBOXID}
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
