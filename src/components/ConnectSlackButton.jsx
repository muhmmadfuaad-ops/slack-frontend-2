import { useEffect, useRef } from 'react';

const buttonStyle = {
  padding: '10px 14px',
  borderRadius: '10px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '600',
};

function ConnectSlackButton({ onConnected }) {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      // Expecting a message from the popup indicating Slack auth success.
      if (event?.data?.type === 'slack-auth-success') {
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
        }
        window.alert('Workspace connected!');
        if (typeof onConnected === 'function') {
          onConnected();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConnected]);

  const slackCallbackUrl = import.meta.env.VITE_SLACK_CALLBACK_URL;
  console.log('slackCallbackUrl:', slackCallbackUrl);
  const handleClick = () => {
    window.location.href = import.meta.env.VITE_SLACK_APP_SHAREABLE_URL;

    // const clientId = import.meta.env.VITE_SLACK_CLIENT_ID;
    // const redirectUri = `${slackCallbackUrl}/slack/oauth/callback`;
    // const scope = 'chat:write,channels:read,groups:read,team:read,im:history,message.channels';
    // const state =
    //   (window.crypto?.randomUUID && window.crypto.randomUUID()) ||
    //   Array.from(window.crypto.getRandomValues(new Uint32Array(4)), (n) => n.toString(16)).join('');

    // const url = new URL('https://slack.com/oauth/v2/authorize');
    // url.searchParams.set('client_id', clientId);
    // url.searchParams.set('redirect_uri', redirectUri);
    // url.searchParams.set('scope', scope);
    // url.searchParams.set('state', state);

    // popupRef.current = window.open(url.toString(), 'slack-auth', 'width=500,height=600');
  };



  return (
    <button style={buttonStyle} onClick={handleClick}>
      Connect Slack Workspace
    </button>
  );
}

export default ConnectSlackButton;
