import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';
import { ConversationsComponent } from './components/conversations/conversations.component';
import { MessagesComponent } from './components/messages/messages.component';
import { EmtyComponent } from './components/emty/emty.component';
import { ChatRoutingModule } from './chat-routing.module';
import { MessageInputComponent } from './components/message-input/message-input.component';
import { ChatHeaderComponent } from './components/chat-hearder/chat-header.component';
import { IonicModule } from '@ionic/angular';
import { MediaViewerComponent } from './components/media-viewer/media-viewer.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { AudioContextModule } from 'angular-audio-context';
import { AudioRecorderComponent } from './components/audio-recorder/audio-recorder.component';
@NgModule({
  declarations: [
    ChatComponent,
    ConversationsComponent,
    MessagesComponent,
    MessageInputComponent,
    EmtyComponent,
    ChatHeaderComponent,
    MediaViewerComponent,
    AudioRecorderComponent
  ],
  imports: [
    ChatRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    IonicModule,
    PickerComponent,
    AudioContextModule.forRoot('balanced')
  ],
  bootstrap: [ChatComponent]
})
export class ChatModule { }
