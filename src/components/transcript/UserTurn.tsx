import React from 'react';
import { MessageTurn } from '../../types/bi';

interface UserTurnProps {
  turn: MessageTurn;
}

export const UserTurn: React.FC<UserTurnProps> = ({ turn }) => {
  return (
    <div className="flex justify-end mb-5 pt-2">
      <div className="max-w-xl bg-[#1e295b] text-white font-medium rounded-2xl rounded-br-xs px-4 py-2 text-xs sm:text-sm leading-relaxed shadow-xs">
        {turn.content}
      </div>
    </div>
  );
};
