import { Component, inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { User } from '../../../../models/conversation.model';
import { ChatService } from '../../services/chat.service';
import { AlertService } from '../../../../services/alert.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
})
export class ChatHeaderComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) otherUser!: User;
  isOtherUserActive = false;
  chat = inject(ChatService);
  alert = inject(AlertService);

  private destroy$ = new Subject<void>();

  ngOnChanges() {
    this.checkUserBlockStatus();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkUserBlockStatus() {
    this.chat
      .isUserBlocked(this.otherUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isOtherUserActive = !res;
        },
      });
  }

  blockUser() {
    this.chat
      .blockUser(this.otherUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.alert.success(this.otherUser.firstName + ': is blocked');
          this.checkUserBlockStatus();
        },
      });
  }

  unblockUser() {
    this.chat
      .unblockUser(this.otherUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        complete: () => {
          this.alert.success(this.otherUser.firstName + ': is unblocked');
          this.checkUserBlockStatus();
        },
      });
  }
}
