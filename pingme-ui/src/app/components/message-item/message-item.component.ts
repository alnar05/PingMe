import {Component, HostListener, Input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MessageResponse} from '../../services/models/message-response';

@Component({
  selector: 'app-message-item',
  imports: [DatePipe],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss'
})
export class MessageItemComponent {
  @Input({required: true}) message!: MessageResponse;
  @Input() self = false;

  selectedImage: string | null = null;
  private readonly backendBaseUrl = 'http://localhost:8080';

  openImagePreview() {
    const imageSource = this.getImageSource();
    if (!imageSource) {
      return;
    }
    this.selectedImage = imageSource;
  }

  closeImagePreview() {
    this.selectedImage = null;
  }

  @HostListener('document:keydown.escape')
  onEscapeKeyPressed() {
    this.closeImagePreview();
  }

  isImageMessage(): boolean {
    return this.message.type === 'IMAGE' && !!this.getImageSource();
  }

  getImageSource(): string {
    if (this.message.mediaUrl) {
      if (this.message.mediaUrl.startsWith('http')) {
        return this.message.mediaUrl;
      }
      return `${this.backendBaseUrl}${this.message.mediaUrl}`;
    }

    const base64Media = this.message.media?.[0];
    if (!base64Media) {
      return '';
    }

    return `data:image/*;base64,${base64Media}`;
  }
}
