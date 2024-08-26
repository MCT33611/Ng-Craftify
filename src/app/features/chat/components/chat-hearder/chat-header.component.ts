import { Component, inject, Input, OnChanges } from '@angular/core';
import { User } from '../../../../models/conversation.model';
import { ChatService } from '../../services/chat.service';
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html'
})
export class ChatHeaderComponent implements OnChanges{
  @Input({ required: true }) otherUser!: User;
  isOtherUserActive = false;
  chat = inject(ChatService);
  alert = inject(AlertService);

  ngOnChanges() {
    this.chat.isUserBlocked(this.otherUser.id).subscribe({
      next:(res)=>{
        this.isOtherUserActive = !res;
      }
    });
  }

  blockUser() {
    this.chat.blockUser(this.otherUser.id).subscribe({
      complete: () => {
        this.alert.success(this.otherUser.firstName + ': is blocked');
      }
    });
  }
  unblockUser() {
    this.chat.unblockUser(this.otherUser.id).subscribe({
      complete: () => {
        this.alert.success(this.otherUser.firstName + ': is unblocked');
      }
    });
  }
}
