import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chat, ChatSummary, Message } from './models/chat.model';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  chats: ChatSummary[] = [];
  activeChat: Chat | null = null;
  prompt = '';
  loading = false;
  error = '';

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    void this.loadChats();
  }

  async loadChats(): Promise<void> {
    this.chatService.getChats().subscribe({
      next: (chats) => {
        this.chats = chats;
        if (!this.activeChat && chats.length > 0) {
          void this.selectChat(chats[0]._id);
        }
      },
      error: () => {
        this.error = 'Failed to load chats.';
      }
    });
  }

  async newChat(): Promise<void> {
    this.chatService.createChat().subscribe({
      next: (chat) => {
        this.chats.unshift({
          _id: chat._id,
          title: chat.title,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt
        });
        this.activeChat = chat;
        this.error = '';
      },
      error: () => {
        this.error = 'Could not create a new chat.';
      }
    });
  }

  async selectChat(chatId: string): Promise<void> {
    this.chatService.getChatById(chatId).subscribe({
      next: (chat) => {
        this.activeChat = chat;
        this.error = '';
      },
      error: () => {
        this.error = 'Could not load selected chat.';
      }
    });
  }

  sendMessage(): void {
    if (!this.activeChat || !this.prompt.trim() || this.loading) {
      return;
    }

    const message = this.prompt.trim();
    this.prompt = '';
    this.loading = true;

    const optimisticMessages: Message[] = [...this.activeChat.messages, { role: 'user', content: message }];
    this.activeChat = { ...this.activeChat, messages: optimisticMessages };

    this.chatService.sendMessage(this.activeChat._id, message).subscribe({
      next: (data) => {
        if (!this.activeChat) return;

        this.activeChat = {
          ...this.activeChat,
          messages: data.messages
        };

        const idx = this.chats.findIndex((chat) => chat._id === this.activeChat?._id);
        if (idx >= 0) {
          this.chats[idx] = {
            ...this.chats[idx],
            title: data.messages[0]?.content?.slice(0, 40) || this.chats[idx].title,
            updatedAt: new Date().toISOString()
          };
        }

        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to send message.';
        this.loading = false;
      }
    });
  }
}
