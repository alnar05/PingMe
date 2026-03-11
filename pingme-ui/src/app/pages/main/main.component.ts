import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import * as Stomp from 'stompjs/lib/stomp.js';
import SockJS from 'sockjs-client';
import {ChatListComponent} from '../../components/chat-list/chat-list.component';
import {MessageItemComponent} from '../../components/message-item/message-item.component';
import {ChatService} from '../../services/services/chat.service';
import {MessageService} from '../../services/services/message.service';
import {ChatResponse} from '../../services/models/chat-response';
import {MessageRequest} from '../../services/models/message-request';
import {MessageResponse} from '../../services/models/message-response';
import {KeycloakService} from '../../utils/keycloak/keycloak.service';
import {Notification} from './models/notification';

@Component({
  selector: 'app-main',
  imports: [FormsModule, DatePipe, ChatListComponent, MessageItemComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') messageContainer?: ElementRef<HTMLDivElement>;

  chats: Array<ChatResponse> = [];
  selectedChat?: ChatResponse;
  chatMessages: Array<MessageResponse> = [];
  messageContent = '';

  private socketClient: any = null;
  private notificationSubscription: any;

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    public keycloakService: KeycloakService
  ) {
  }

  ngOnInit() {
    this.initWebSocket();
    this.loadChats();
  }

  ngOnDestroy() {
    if (this.socketClient !== null) {
      this.socketClient.disconnect();
      this.notificationSubscription?.unsubscribe();
      this.socketClient = null;
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onChatSelected(chat: ChatResponse) {
    this.selectedChat = chat;
    this.chatMessages = [];
    this.loadMessages(chat.id as string);
    this.setMessagesToSeen();
    if (this.selectedChat.unreadCount) {
      this.selectedChat.unreadCount = 0;
    }
  }

  isSelfMessage(message: MessageResponse): boolean {
    return message.senderId === this.keycloakService.userId;
  }

  sendMessage() {
    if (!this.selectedChat?.id || !this.messageContent.trim()) {
      return;
    }

    const messageRequest: MessageRequest = {
      chatId: this.selectedChat.id,
      senderId: this.getSenderId(),
      receiverId: this.getReceiverId(),
      content: this.messageContent,
      type: 'TEXT'
    };

    this.messageService.saveMessage({body: messageRequest}).subscribe({
      next: () => {
        this.chatMessages.push({
          senderId: messageRequest.senderId,
          receiverId: messageRequest.receiverId,
          content: messageRequest.content,
          type: 'TEXT',
          state: 'SENT',
          createdAt: new Date().toISOString()
        });

        this.selectedChat!.lastMessage = this.messageContent;
        this.selectedChat!.lastMessageTime = new Date().toISOString();
        this.messageContent = '';
      }
    });
  }

  uploadMedia(target: EventTarget | null) {
    const file = this.extractFileFromTarget(target);
    if (!file || !this.selectedChat?.id) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const payload = reader.result?.toString().split(',')[1];

      this.messageService.uploadMedia({
        'chat-id': this.selectedChat!.id as string,
        body: {file}
      }).subscribe({
        next: () => {
          this.chatMessages.push({
            senderId: this.getSenderId(),
            receiverId: this.getReceiverId(),
            content: 'Attachment',
            type: 'IMAGE',
            state: 'SENT',
            media: payload ? [payload] : undefined,
            createdAt: new Date().toISOString()
          });
          this.selectedChat!.lastMessage = 'Attachment';
          this.selectedChat!.lastMessageTime = new Date().toISOString();
        }
      });
    };

    reader.readAsDataURL(file);
  }

  logout() {
    this.keycloakService.logout();
  }

  private loadChats() {
    this.chatService.getChatsByReceiver().subscribe({
      next: (chats) => {
        this.chats = chats;
      }
    });
  }

  private loadMessages(chatId: string) {
    this.messageService.getAllMessages({'chat-id': chatId}).subscribe({
      next: (messages) => {
        this.chatMessages = messages;
      }
    });
  }

  private setMessagesToSeen() {
    if (!this.selectedChat?.id) {
      return;
    }

    this.messageService.setMessageToSeen({'chat-id': this.selectedChat.id}).subscribe();
  }

  private initWebSocket() {
    const userId = this.keycloakService.keycloak.tokenParsed?.sub;
    if (!userId) {
      return;
    }

    const ws = new SockJS('http://localhost:8080/ws');
    this.socketClient = Stomp.over(ws);
    const subUrl = `/user/${userId}/chat`;

    this.socketClient.connect(
      {Authorization: `Bearer ${this.keycloakService.keycloak.token}`},
      () => {
        this.notificationSubscription = this.socketClient.subscribe(subUrl, (message: any) => {
          this.handleNotification(JSON.parse(message.body));
        });
      }
    );
  }

  private handleNotification(notification: Notification) {
    if (!notification) {
      return;
    }

    if (this.selectedChat?.id === notification.chatId) {
      if (notification.type === 'SEEN') {
        this.chatMessages.forEach((m) => m.state = 'SEEN');
        return;
      }

      this.chatMessages.push({
        senderId: notification.senderId,
        receiverId: notification.receiverId,
        content: notification.content,
        type: notification.messageType,
        media: notification.media,
        createdAt: new Date().toISOString()
      });
      this.selectedChat!.lastMessage = notification.type === 'IMAGE' ? 'Attachment' : notification.content;
      this.selectedChat!.lastMessageTime = new Date().toISOString();
      return;
    }

    const destChat = this.chats.find((chat) => chat.id === notification.chatId);
    if (destChat && notification.type !== 'SEEN') {
      destChat.lastMessage = notification.type === 'IMAGE' ? 'Attachment' : notification.content;
      destChat.lastMessageTime = new Date().toISOString();
      destChat.unreadCount = (destChat.unreadCount ?? 0) + 1;
      return;
    }

    if (notification.type === 'MESSAGE') {
      this.chats.unshift({
        id: notification.chatId,
        senderId: notification.senderId,
        receiverId: notification.receiverId,
        lastMessage: notification.content,
        name: notification.chatName,
        unreadCount: 1,
        lastMessageTime: new Date().toISOString()
      });
    }
  }

  private getSenderId(): string {
    if (this.selectedChat?.senderId === this.keycloakService.userId) {
      return this.selectedChat.senderId as string;
    }
    return this.selectedChat?.receiverId as string;
  }

  private getReceiverId(): string {
    if (this.selectedChat?.senderId === this.keycloakService.userId) {
      return this.selectedChat.receiverId as string;
    }
    return this.selectedChat?.senderId as string;
  }

  private scrollToBottom() {
    if (!this.messageContainer) {
      return;
    }

    const container = this.messageContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  private extractFileFromTarget(target: EventTarget | null): File | null {
    const htmlInputTarget = target as HTMLInputElement;
    return htmlInputTarget?.files?.[0] ?? null;
  }
}
