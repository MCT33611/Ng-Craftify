import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewChecked, NgZone, inject, OnInit } from '@angular/core';
import { Conversation } from '../../../../models/conversation.model';
import { MediaType, Message, MessageMedia, MessageType } from '../../../../models/message.model';
import { ChatService } from '../../services/chat.service';
import { IApiResponse } from '../../../../models/api-response.models';
import { MatDialog } from '@angular/material/dialog';
import { MediaViewerComponent } from '../media-viewer/media-viewer.component';

interface List {
  id?: string;
  content: string;
  time?: Date;
  type: MessageType;
  isMy: boolean;
  isDeleted: boolean;
  media: MessageMedia[];
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnChanges, OnInit {
  MediaType = MediaType;
  @Input({ required: true }) conversation!: Conversation;
  @Input({ required: true }) currentUserId!: string;
  messages: List[] = [];
  chat = inject(ChatService);
  dialog = inject(MatDialog);

  editingMessageId: string | null = null;
  editContent: string = '';


  ngOnChanges(): void {
    this.loadMessages();
  }
  ngOnInit(): void {
    this.setupListeners();
  }


  loadMessages(): void {
    this.chat.getMessagesByConversationId(this.conversation.id).subscribe({
      next: (response: { $id: string, messages: IApiResponse<Message> }) => {
        this.messages = response.messages.$values
          .map((msg: any): List => ({
            id: msg.id,
            content: msg.content,
            isMy: msg.fromId === this.currentUserId,
            time: msg.timestamp ? new Date(msg.timestamp) : undefined,
            type: msg.type,
            isDeleted: false,
            media: msg.media["$values"]
          }))
          .sort((a, b) => {
            if (!a.time) return 1;
            if (!b.time) return -1;
            return a.time.getTime() - b.time.getTime();
          });
          console.log(this.messages);
          
      },
      error: (err: any) => console.error('Error loading messages:', err)
    });
  }

  setupListeners(): void {
    this.chat.messageReceivedListener((newMsg: any) => {
      const msg: List = {
        content: newMsg.content,
        isMy: newMsg.fromId === this.currentUserId,
        time: newMsg.timestamp,
        type: newMsg.type,
        isDeleted: false,
        media: newMsg.media,
      };
      this.messages.push(msg);
    });

    this.chat.messageDeletedListener((deletedMsgId: string) => {
      const index = this.messages.findIndex(m => m.id === deletedMsgId);
      if (index !== -1) {
        this.messages[index].isDeleted = true;
        this.messages[index].content = '';
      }
    });

    this.chat.messageUpdatedListener((updatedMsg: Message) => {
      const index = this.messages.findIndex(m => m.id === updatedMsg.id);
      if (index !== -1) {
        this.messages[index] = {
          ...this.messages[index],
          content: updatedMsg.content,
          time: updatedMsg.timestamp
        };
      }
    });
  }

  startEditing(message: List) {
    this.editingMessageId = message.id!;
    this.editContent = message.content;
  }

  cancelEditing() {
    this.editingMessageId = null;
    this.editContent = '';
  }

  saveEdit() {
    if (this.editingMessageId && this.editContent.trim()) {
      this.chat.updateMessage(this.editingMessageId, { content: this.editContent } as Message).then(() => {
        this.cancelEditing();
      }).catch((error: any) => {
        console.error('Error updating message:', error);
      });
    }
  }

  openMediaViewer(media: MessageMedia) {
    this.dialog.open(MediaViewerComponent, {
      data: media
    });
  }
  public DetermineMediaType(contentType: string): MediaType {
    if (contentType.startsWith("image/")) {
      return MediaType.Image;
    } else if (contentType.startsWith("video/")) {
      return MediaType.Video;
    } else if (contentType.startsWith("audio/")) {
      return MediaType.Audio;
    } else {
      return MediaType.Document;
    }
   }
}