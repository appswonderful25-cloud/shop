export interface StrapiUser {
  id: number;
  documentId?: string;
  username?: string;
  email?: string;
}

export interface ConversationMessage {
  id: number;
  documentId?: string;
  content: string;
  isRead: boolean;
  image?: string | null;
  users_permissions_user: StrapiUser | null;
  createdAt?: string;
}

export interface MessageThread {
  id: number;
  documentId?: string;
  subject: string;
  statusRead: boolean;
  online: boolean;
  user: StrapiUser | null;
  sender: StrapiUser | null;
  messages_conversations: ConversationMessage[];
  updatedAt?: string;
}
