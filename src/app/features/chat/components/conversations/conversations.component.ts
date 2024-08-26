import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Conversation, User } from '../../../../models/conversation.model';
import { ChatService } from '../../services/chat.service';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { IUser } from '../../../../models/iuser';
import { ProfileStore } from '../../../../shared/store/profile.store';

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
  styleUrl: './conversations.component.css'
})
export class ConversationsComponent implements OnChanges {
  @Output() onSelect = new EventEmitter<Conversation>();
  @Input({ required: true }) convesations: Conversation[] = [];
  @Input({ required: true }) currentUserId!: string;

  list: List[] = [];
  chat = inject(ChatService);
  profileStore = inject(ProfileStore);

  convLoading = false;


  constructor() {
    this.profileStore.loadAll();
  }

  ngOnChanges(): void {
    this.convLoading = true
    this.updateList();
  }

  updateList() {

    const observables = this.convesations.map(conv => {
      const otherUser = this.otherUser(conv);

      return this.chat.getUnreadMessagesCount(conv.id).pipe(
        catchError(error => {
          return of(0);
        })
      ).pipe(
        map((unReadCount: number) => {
          return {
            id: conv.id,
            title: otherUser?.firstName ?? 'Unknown',
            pictureUrl: otherUser?.profilePicture ?? 'assets/images/moutain-sun-preview.jpg',
            unReadCount,
            msgPreview: 'latest message',
            isBlocked: conv.isBlocked,
            isRead: unReadCount == 0
          };
        })
      );
    });

    forkJoin(observables).subscribe({
      next: (results: List[]) => {
        this.list = results;
        
      },
      error: (error) => console.error('Error updating list:', error),
      complete:() => this.convLoading = false
    });
  }

  onConvSelect(convId: string) {
    let conv = this.convesations.find(ele => ele.id == convId);
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

    if (conv.peerOneId === this.currentUserId)
      return conv.peerTwo;
    else if (conv.peerTwoId === this.currentUserId)
      return conv.peerOne;

    return null;
  }
}