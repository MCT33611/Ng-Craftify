import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import { Conversation, User } from '../../../../models/conversation.model';
import { ChatService } from '../../services/chat.service';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { forkJoin, of, Subject } from 'rxjs';
import { ProfileStore } from '../../../../shared/store/profile.store';
import { AlertService } from '../../../../services/alert.service';

interface List {
  id: string;
  title: string;
  pictureUrl?: string;
  unReadCount?: number;
  msgPreview?: string;
  isBlocked: boolean;
  isRead: boolean;
}

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css',
})
export class ConversationsComponent implements OnChanges, OnDestroy {
  @Output() onSelect = new EventEmitter<Conversation>();
  @Input({ required: true }) conversations: Conversation[] = [];
  @Input({ required: true }) currentUserId!: string;

  list: List[] = [];
  private chat = inject(ChatService);
  profileStore = inject(ProfileStore);
  private alert = inject(AlertService);
  convLoading = false;
  private destroy$ = new Subject<void>();

  constructor() {
    this.profileStore.loadAll();
  }

  ngOnChanges(): void {
    this.convLoading = true;
    this.updateList();
  }

  updateList() {
    const observables = this.conversations.map((conv) => {
      const otherUser = this.otherUser(conv);

      return this.chat.getUnreadMessagesCount(conv.id).pipe(
        catchError((error) => {
          console.error('Error getting unread message count:', error);
          return of(0);
        }),
        map((unReadCount: number) => ({
          id: conv.id,
          title: otherUser?.firstName ?? 'Unknown',
          pictureUrl:
            otherUser?.profilePicture ??
            'assets/images/moutain-sun-preview.jpg',
          unReadCount,
          msgPreview: 'latest message',
          isBlocked: conv.isBlocked,
          isRead: unReadCount == 0,
        }))
      );
    });

    forkJoin(observables)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results: List[]) => {
          this.list = results;
        },
        error: (error) => {
          console.error('Error updating list:', error);
          this.alert.error('Failed to update conversation list');
        },
        complete: () => (this.convLoading = false),
      });
  }

  onConvSelect(convId: string) {
    let conv = this.conversations.find(ele => ele.id == convId);
    if (conv) {
      this.onSelect.emit(conv);
      this.chat.markConversationAsRead(conv.id)
    } else {
      console.warn('Selected conversation not found:', convId);
    }

  }

  otherUser(conv: Conversation): User | null {
    if (!this.currentUserId) {
      console.warn('Current user ID is not set');
      return null;
    }

    return conv.peerOneId === this.currentUserId ? conv.peerTwo : conv.peerOne;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
