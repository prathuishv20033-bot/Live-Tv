import React, { useState } from 'react';
import { Tv } from 'lucide-react';

export interface Channel {
  id: string;
  name: string;
  url: string;
  logo?: string;
}

interface DashboardProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

const ChannelCard: React.FC<{ channel: Channel; onClick: () => void }> = ({ channel, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="channel-card" onClick={onClick}>
      <div className="channel-logo-wrapper">
        {channel.logo && !imgError ? (
          <img 
            src={channel.logo} 
            alt={`${channel.name} logo`} 
            onError={() => setImgError(true)}
          />
        ) : (
          <Tv size={32} className="logo-icon" />
        )}
      </div>
      
      <div className="channel-info">
        <span className="channel-name">{channel.name}</span>
        <span className="channel-status">
          <span className="live-dot"></span>
          Live Now
        </span>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ channels, onSelectChannel }) => {
  return (
    <div className="channel-grid">
      {channels.map((channel) => (
        <ChannelCard 
          key={channel.id} 
          channel={channel} 
          onClick={() => onSelectChannel(channel)} 
        />
      ))}
    </div>
  );
};

export default Dashboard;
