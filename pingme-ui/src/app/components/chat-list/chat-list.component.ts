import {Component, computed, input, InputSignal, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ChatResponse} from '../../services/models/chat-response';
import {UserResponse} from '../../services/models/user-response';
import {ChatService} from '../../services/services/chat.service';
import {UserService} from '../../services/services/user.service';
import {KeycloakService} from '../../utils/keycloak/keycloak.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  imports: [FormsModule],
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  selectedChatId: InputSignal<string | undefined> = input<string | undefined>(undefined);
  chatSelected = output<ChatResponse>();

  searchTerm = signal('');
  creatingChat = signal(false);
  contacts = signal<Array<UserResponse>>([]);

  filteredChats = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) {
      return this.chats();
    }

    return this.chats().filter((chat) =>
      `${chat.name ?? ''} ${chat.lastMessage ?? ''}`.toLowerCase().includes(query)
    );
  });

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private keycloakService: KeycloakService
  ) {
  }

  toggleCreateChat() {
    if (this.creatingChat()) {
      this.creatingChat.set(false);
      return;
    }

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.contacts.set(users);
        this.creatingChat.set(true);
      }
    });
  }

  selectContact(contact: UserResponse) {
    this.chatService.createChat({
      'sender-id': this.keycloakService.userId,
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
          unreadCount: 0
        };

        this.chats().unshift(chat);
        this.creatingChat.set(false);
        this.chatSelected.emit(chat);
      }
    });
  }

  selectChat(chat: ChatResponse) {
    this.chatSelected.emit(chat);
  }
}
