import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatListComponent} from '../../components/chat-list/chat-list.component';
import {KeycloakService} from '../../utils/keycloak/keycloak.service';
import {ChatResponse} from '../../services/models/chat-response';
import {MessageService} from '../../services/services/message.service';
import {MessageResponse} from '../../services/models/message-response';
import * as Stomp from 'stompjs/lib/stomp.js';
import SockJS from 'sockjs-client';
import {MessageRequest} from '../../services/models/message-request';
import {Notification} from './models/notification';
import {ChatService} from '../../services/services/chat.service';
import {ChatComponent} from '../../components/chat/chat.component';

@Component({
  selector: 'app-main',
  imports: [ChatListComponent, ChatComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {
  selectedChat: ChatResponse | null = null;
  chats: Array<ChatResponse> = [];
  chatMessages: Array<MessageResponse> = [];
  socketClient: any = null;
  private notificationSubscription: any;

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    public keycloakService: KeycloakService,
  ) {}

  ngOnInit(): void {
    this.initWebSocket();
    this.getAllChats();
  }

  ngOnDestroy(): void {
    if (this.socketClient !== null) {
      this.socketClient.disconnect();
      this.notificationSubscription?.unsubscribe();
      this.socketClient = null;
    }
  }

  chatSelected(chatResponse: ChatResponse) {
    this.selectedChat = chatResponse;
    this.getAllChatMessages(chatResponse.id as string);
    this.setMessagesToSeen();
    this.selectedChat.unreadCount = 0;
  }

  sendTextMessage(content: string) {
    if (!this.selectedChat) return;
    const messageRequest: MessageRequest = {
      chatId: this.selectedChat.id,
      senderId: this.getSenderId(),
      receiverId: this.getReceiverId(),
      content,
      type: 'TEXT',
    };
    this.messageService.saveMessage({body: messageRequest}).subscribe({
      next: () => {
        const message: MessageResponse = {
          senderId: this.getSenderId(),
          receiverId: this.getReceiverId(),
          content,
          type: 'TEXT',
          state: 'SENT',
          createdAt: new Date().toString()
        };
        this.chatMessages.push(message);
        this.promoteChat(this.selectedChat!, content);
      }
    });
  }

  uploadMedia(file: File) {
    if (!this.selectedChat) return;
    this.messageService.uploadMedia({'chat-id': this.selectedChat.id as string, body: {file}}).subscribe({
      next: () => {
        this.getAllChatMessages(this.selectedChat!.id as string);
      }
    });
  }

  setFavourite(payload: {chatId: string; favourite: boolean}) {
    this.chatService.setChatFavourite(payload.chatId, payload.favourite).subscribe();
  }

  logout() { this.keycloakService.logout(); }

  markSelectedMessagesSeen() { this.setMessagesToSeen(); }

  private setMessagesToSeen() {
    if (!this.selectedChat?.id) return;
    this.messageService.setMessageToSeen({'chat-id': this.selectedChat.id}).subscribe();
  }

  private getAllChats() {
    this.chatService.getChatsByReceiver().subscribe({ next: (res) => this.chats = res });
  }

  private getAllChatMessages(chatId: string) {
    this.messageService.getAllMessages({'chat-id': chatId}).subscribe({ next: (messages) => this.chatMessages = messages });
  }

  private initWebSocket() {
    if (this.keycloakService.keycloak.tokenParsed?.sub) {
      const ws = new SockJS('http://localhost:8080/ws');
      this.socketClient = Stomp.over(ws);
      const subUrl = `/user/${this.keycloakService.keycloak.tokenParsed?.sub}/chat`;
      this.socketClient.connect({'Authorization': `Bearer ${this.keycloakService.keycloak.token}`}, () => {
        this.notificationSubscription = this.socketClient.subscribe(subUrl, (message: any) => {
          this.handleNotification(JSON.parse(message.body) as Notification);
        });
      });
    }
  }

  private handleNotification(notification: Notification) {
    if (!notification) return;
    const isSelected = this.selectedChat?.id === notification.chatId;

    if (isSelected && notification.type !== 'SEEN') {
      this.chatMessages.push({
        senderId: notification.senderId,
        receiverId: notification.receiverId,
        content: notification.content,
        type: notification.messageType,
        media: notification.media,
        fileName: notification.fileName,
        mimeType: notification.mimeType,
        fileSize: notification.fileSize,
        createdAt: new Date().toString()
      });
      this.selectedChat!.lastMessage = notification.messageType === 'TEXT' ? notification.content : (notification.fileName || notification.messageType || 'Attachment');
      this.promoteChat(this.selectedChat!, this.selectedChat!.lastMessage || '');
      return;
    }

    if (notification.type === 'SEEN') {
      this.chatMessages.forEach(m => m.state = 'SEEN');
      return;
    }

    const destChat = this.chats.find(c => c.id === notification.chatId);
    const lastMessage = notification.messageType === 'TEXT' ? notification.content : (notification.fileName || notification.messageType || 'Attachment');

    if (destChat) {
      destChat.lastMessage = lastMessage;
      destChat.lastMessageTime = new Date().toString();
      destChat.unreadCount = (destChat.unreadCount ?? 0) + 1;
      this.promoteChat(destChat, lastMessage || "Attachment");
    } else {
      this.chats.unshift({
        id: notification.chatId,
        senderId: notification.senderId,
        receiverId: notification.receiverId,
        lastMessage,
        name: notification.chatName,
        unreadCount: 1,
        lastMessageTime: new Date().toString(),
        favourite: false
      });
    }
  }

  private promoteChat(chat: ChatResponse, messagePreview: string) {
    chat.lastMessage = messagePreview;
    chat.lastMessageTime = new Date().toString();
    this.chats = [chat, ...this.chats.filter(c => c.id !== chat.id)];
  }

  private getSenderId(): string {
    return this.selectedChat?.senderId === this.keycloakService.userId ? this.selectedChat.senderId as string : this.selectedChat?.receiverId as string;
  }

  private getReceiverId(): string {
    return this.selectedChat?.senderId === this.keycloakService.userId ? this.selectedChat.receiverId as string : this.selectedChat?.senderId as string;
  }
}
