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
      <div className="bg-dark-matter p-3 rounded-lg mb-4">
        <h4 className="m-0 mb-2 text-gray-200 font-semibold">Rewards:</h4>
        <ul className="m-0 pl-5 text-gray-light list-disc">
          <li>+250 XP</li>
          <li>"Bug Squasher" Title</li>
          <li>Access to the QA Guild</li>
        </ul>
      </div>
    </Card>
  );
};

export default QuestLog;