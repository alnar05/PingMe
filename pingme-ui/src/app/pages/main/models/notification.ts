export interface Notification {
  chatId?: string;
  content?: string;
  senderId?: string;
  receiverId?: string;
  messageType?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE';
  type?: 'SEEN' | 'MESSAGE' | 'MEDIA';
  chatName?: string;
  media?: Array<string>;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
}
