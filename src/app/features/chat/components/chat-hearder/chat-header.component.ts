import { Component, Input } from '@angular/core';
import { User } from '../../../../models/conversation.model';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html'
})
export class ChatHeaderComponent {
  @Input({ required: true }) otherUser!: User;
}
