import {Component, input, output} from '@angular/core';
import {ChatResponse} from '../../services/models/chat-response';
import {MessageResponse} from '../../services/models/message-response';
import {FormsModule} from '@angular/forms';
import {PickerComponent} from '@ctrl/ngx-emoji-mart';
import {EmojiData} from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {MessageItemComponent} from '../message-item/message-item.component';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, PickerComponent, MessageItemComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  selectedChat = input<ChatResponse | null>(null);
  messages = input<MessageResponse[]>([]);
  currentUserId = input<string | undefined>();

  sendTextMessage = output<string>();
  uploadMedia = output<File>();
  markAsSeen = output<void>();

  messageContent = '';
  showEmojis = false;

  isSelfMessage(message: MessageResponse): boolean {
    return message.senderId === this.currentUserId();
  }

  onSend() {
    if (this.messageContent.trim()) {
      this.sendTextMessage.emit(this.messageContent.trim());
      this.messageContent = '';
      this.showEmojis = false;
    }
  }

  onSelectEmojis(emojiSelected: any) {
    const emoji: EmojiData = emojiSelected.emoji;
    this.messageContent += emoji.native;
  }

  onFileSelected(target: EventTarget | null) {
    const input = target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.uploadMedia.emit(input.files[0]);
      input.value = '';
    }
  }
}
