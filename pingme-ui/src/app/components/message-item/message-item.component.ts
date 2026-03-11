import {Component, HostListener, input} from '@angular/core';
import {MessageResponse} from '../../services/models/message-response';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-message-item',
  imports: [DatePipe],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss'
})
export class MessageItemComponent {
  message = input.required<MessageResponse>();
  isSelf = input<boolean>(false);
  zoom = 1;
  imagePreviewOpen = false;

  openImagePreview() { this.imagePreviewOpen = true; this.zoom = 1; }
  closeImagePreview() { this.imagePreviewOpen = false; }
  onZoom(delta: number) { this.zoom = Math.max(0.5, Math.min(3, this.zoom + delta)); }
  fileSizeLabel(size?: number): string { return !size ? '' : `${(size / (1024 * 1024)).toFixed(2)} MB`; }

  @HostListener('document:keydown.escape')
  onEscape() { if (this.imagePreviewOpen) this.closeImagePreview(); }
}
