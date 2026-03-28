import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Chat, ChatSummary, Message } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly baseUrl = `${environment.apiBaseUrl}/chats`;

  constructor(private readonly http: HttpClient) {}

  getChats(): Observable<ChatSummary[]> {
    return this.http.get<ChatSummary[]>(this.baseUrl);
  }

  createChat(): Observable<Chat> {
    return this.http.post<Chat>(this.baseUrl, {});
  }

  getChatById(id: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.baseUrl}/${id}`);
  }

  sendMessage(chatId: string, prompt: string): Observable<{ chatId: string; reply: string; messages: Message[] }> {
    return this.http.post<{ chatId: string; reply: string; messages: Message[] }>(`${this.baseUrl}/${chatId}/message`, {
      prompt
    });
  }
}
