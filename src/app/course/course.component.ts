import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  @ViewChild('DivRef') DivRef: ElementRef;
  courses = [];
  course: { id: number; path: string; idCourse: string };
  asd = [];
  videoPath = '';
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.firebaseService.fetchVideos(+this.route.snapshot.params.id);

    this.route.params.subscribe((params: Params) => {
      this.courses = this.firebaseService.getVideos();
    });
    this.initSrc();
  }
  initSrc() {
    setTimeout(() => {
      const asd123 = this.firebaseService.getOneVideo();
      this.videoPath = asd123.path;
    }, 2000);
  }

  handleClick(event) {
    const newArr = event.target.querySelector('iframe').src.split('/');
    this.videoPath = newArr[4];
  }

  handleDispatch() {
    this.firebaseService.setCurrentCourse(+this.route.snapshot.params.id);
  }
}
