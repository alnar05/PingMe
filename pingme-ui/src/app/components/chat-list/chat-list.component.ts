import {Component, computed, input, InputSignal, output} from '@angular/core';
import {ChatService} from '../../services/services/chat.service';
import {ChatResponse} from '../../services/models/chat-response';
import {DatePipe} from '@angular/common';
import {UserService} from '../../services/services/user.service';
import {UserResponse} from '../../services/models/user-response';
import {KeycloakService} from '../../utils/keycloak/keycloak.service';
import {FormsModule} from '@angular/forms';

type ChatFilter = 'ALL' | 'UNREAD' | 'FAVOURITES';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  imports: [DatePipe, FormsModule],
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  selectedChatId = input<string | undefined>();
  searchNewContact = false;
  contacts: Array<UserResponse> = [];
  chatSelected = output<ChatResponse>();
  favouriteToggled = output<{chatId: string; favourite: boolean}>();
  searchTerm = '';
  activeFilter: ChatFilter = 'ALL';

  filteredChats = computed(() => {
    const term = this.searchTerm.trim().toLowerCase();
    return this.chats().filter(chat => {
      const matchesSearch = !term
        || (chat.name ?? '').toLowerCase().includes(term)
        || (chat.lastMessage ?? '').toLowerCase().includes(term);
      const matchesFilter = this.activeFilter === 'ALL'
        || (this.activeFilter === 'UNREAD' && (chat.unreadCount ?? 0) > 0)
        || (this.activeFilter === 'FAVOURITES' && !!chat.favourite);
      return matchesSearch && matchesFilter;
    });
  });

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private keycloakService: KeycloakService
  ) {}

  searchContact() {
    this.userService.getAllUsers().subscribe({
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
          name: `${contact.firstName} ${contact.lastName}`,
          recipientOnline: contact.online,
          lastMessageTime: contact.lastSeen,
          senderId: this.keycloakService.userId,
          receiverId: contact.id,
          favourite: false,
          unreadCount: 0
        };
        this.chats().unshift(chat);
        this.searchNewContact = false;
        this.chatSelected.emit(chat);
      }
    });
  }

  wrapMessage(lastMessage: string | undefined): string {
    if (!lastMessage) return '';
    return lastMessage.length <= 28 ? lastMessage : `${lastMessage.substring(0, 25)}...`;
  }

  setFilter(filter: ChatFilter) {
    this.activeFilter = filter;
  }

  toggleFavourite(chat: ChatResponse, event: MouseEvent) {
    event.stopPropagation();
    const nextValue = !chat.favourite;
    chat.favourite = nextValue;
    this.favouriteToggled.emit({chatId: chat.id as string, favourite: nextValue});
  }
}
