import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafePipe } from './../yt-video.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [SafePipe],
  exports: [SafePipe],
})
export class SharedModule {}
