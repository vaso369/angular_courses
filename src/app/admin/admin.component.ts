import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  courses = [];
  course: { id: number; path: string; idCourse: string };
  videoPath = '';
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.fetchAdminVideos();
    this.courses = this.firebaseService.getAdminVideos();
    this.initSrc();
  }

  initSrc() {
    setTimeout(() => {
      if (this.courses !== null) {
        const asd123 = this.firebaseService.getOneAdminVideo();
        this.videoPath = asd123.path;
      } else {
        this.videoPath = '';
      }
    }, 2000);
  }

  handleClick(event) {
    const newArr = event.target.querySelector('iframe').src.split('/');
    this.videoPath = newArr[4];
  }
  handleDispatch() {
    this.firebaseService.approveVideos(this.videoPath);
    setTimeout(() => {
      this.firebaseService.deleteVideo();
      this.courses = this.courses.filter((el) => el.path !== this.videoPath);
      this.videoPath = `${this.courses[0].path}`;
    }, 1000);
  }
  handleDispatchDelete() {
    this.firebaseService.getDeleteVideoAdmin(this.videoPath);
    setTimeout(() => {
      this.firebaseService.deleteVideoAdmin();
      this.courses = this.courses.filter((el) => el.path !== this.videoPath);
      this.videoPath = `${this.courses[0].path}`;
    }, 1000);
  }
}
