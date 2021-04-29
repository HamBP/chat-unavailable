import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class KakaoWorkService {
  private readonly kakaoInstance: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.kakaoInstance = axios.create({
      baseURL: 'https://api.kakaowork.com',
      headers: {
        Authorization: `Bearer ${config.get('kakaoWork_bot')}`,
      },
    });
  }

  async getUserList() {
    const res = await this.kakaoInstance.get('/v1/users.list');
    return res.data.users;
  }

  async openConversations({ userId }) {
    const data = {
      user_id: userId,
    };
    const res = await this.kakaoInstance.post('/v1/conversations.open', data);
    return res.data.conversation;
  }

  async sendMessage({ conversationId, text, blocks }) {
    const data = {
      conversation_id: conversationId,
      text,
      ...(blocks && { blocks }),
    };
    const res = await this.kakaoInstance.post('/v1/messages.send', data);
    return res.data.message;
  }
}
