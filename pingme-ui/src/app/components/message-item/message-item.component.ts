import {Component, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MessageResponse} from '../../services/models/message-response';

@Component({
  selector: 'app-message-item',
  imports: [DatePipe],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss'
})
export class MessageItemComponent {
  message = input.required<MessageResponse>();
  mine = input(false);
}
