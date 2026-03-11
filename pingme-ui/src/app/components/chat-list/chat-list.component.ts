import {Component, input, InputSignal, output} from '@angular/core';
import {ChatService} from '../../services/services/chat.service';
import {ChatResponse} from '../../services/models/chat-response';
import {DatePipe} from '@angular/common';
import {UserService} from '../../services/services/user.service';
import {UserResponse} from '../../services/models/user-response';
import {KeycloakService} from '../../utils/keycloak/keycloak.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  imports: [
    DatePipe,
    FormsModule
  ],
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  searchNewContact = false;
  searchTerm = '';
  activeFilter: 'ALL' | 'UNREAD' = 'ALL';
  contacts: Array<UserResponse> = [];
  chatSelected = output<ChatResponse>();

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private keycloakService: KeycloakService
  ) {
  }

  searchContact() {
    this.userService.getAllUsers()
      .subscribe({
        next: (users) => {
          this.contacts = users;
          this.searchNewContact = true;
        }
      });
  }

  selectContact(contact: UserResponse) {
    this.chatService.createChat({
      'sender-id': this.keycloakService.userId as string,
      'receiver-id': contact.id as string
    }).subscribe({
      next: (res) => {
        const chat: ChatResponse = {
          id: res.response,
          name: contact.firstName + ' ' + contact.lastName,
          recipientOnline: contact.online,
          lastMessageTime: contact.lastSeen,
          senderId: this.keycloakService.userId,
          receiverId: contact.id
        };
        this.chats().unshift(chat);
        this.searchNewContact = false;
        this.chatSelected.emit(chat);
      }
    });

  }

  chatClicked(chat: ChatResponse) {
    this.chatSelected.emit(chat);
  }

  setFilter(filter: 'ALL' | 'UNREAD') {
    this.activeFilter = filter;
  }

  filteredChats(): ChatResponse[] {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();
    return this.chats().filter((chat) => {
      const matchesSearch = !normalizedSearch
        || chat.name?.toLowerCase().includes(normalizedSearch)
        || chat.lastMessage?.toLowerCase().includes(normalizedSearch);

      const matchesFilter = this.activeFilter === 'ALL'
        || (chat.unreadCount ?? 0) > 0;

      return matchesSearch && matchesFilter;
    });
  }

  wrapMessage(lastMessage: string | undefined): string {
    if (lastMessage && lastMessage.length <= 20) {
      return lastMessage;
    }
    return lastMessage?.substring(0, 17) + '...';
  }
}
