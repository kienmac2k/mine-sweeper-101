import React from 'react';
import { MessageBox as StyledMessageBox } from '../styles/GameStyles';

interface MessageBoxProps {
  message: string | null;
}

export const MessageBox: React.FC<MessageBoxProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <StyledMessageBox>
      {message}
    </StyledMessageBox>
  );
}; 