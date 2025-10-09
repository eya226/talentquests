import React from 'react';
import Card from '../../components/Card';

const QuestLog: React.FC = () => {
  return (
    <Card
      title="Your Next Quest"
      description="The Bug Hunter's Guild is looking for new recruits. Are you ready to squash some bugs and earn your first title?"
      buttonText="Start First Quest"
      onButtonClick={() => alert('Quest system coming in Phase 2!')}
    >
      <div style={{
        backgroundColor: '#1F2937', // Dark Matter
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <h4 style={{ margin: 0, marginBottom: '8px', color: '#E5E7EB' }}>Rewards:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#D1D5DB' }}>
          <li>+250 XP</li>
          <li>"Bug Squasher" Title</li>
          <li>Access to the QA Guild</li>
        </ul>
      </div>
    </Card>
  );
};

export default QuestLog;