export interface kakaoUser {
  id: string;
  space_id: string;
  name: string;
}

export interface kakaoConversation {
  id: string;
  type: string;
  users_count: number;
}

export interface kakaoWorkGetUserListOutput {
  success: boolean;
  users?: kakaoUser[];
  error?: {
    code: string;
    message: string;
  };
}

export interface kakaoWorkOpenConversationOutput {
  success: boolean;
  conversations?: kakaoConversation[];
  error?: {
    code: string;
    message: string;
  };
}
