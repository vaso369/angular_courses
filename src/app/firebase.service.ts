import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { BehaviorSubject } from 'rxjs';
import { Video } from './models/video';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    private ngZone: NgZone,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private http: HttpClient,
    private service: NotificationsService
  ) {}
  videoCollection: AngularFirestoreCollection<Video>;
  courses = [];
  videos = [];
  adminVideos = [];
  currentCourse = '';
  deleteVideoID = '';
  deleteVideoID_temp = '';
  getRandomVideo = '';
  public currentUser: any;
  public userStatus: string;
  public userStatusChanges: BehaviorSubject<string> = new BehaviorSubject<
    string
  >(this.userStatus);
  header = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
    }),
  };
  onSuccess(message) {
    this.service.success('Success', message, {
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    });
  }
  onError(message) {
    this.service.error('Error', message, {
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    });
  }
  getOneVideo() {
    return this.videos[0];
  }
  getOneAdminVideo() {
    return this.adminVideos[0];
  }
  setCurrentCourse(value) {
    this.currentCourse = value;
  }
  resetCourses() {
    this.courses = [];
  }
  fetchAdminVideos() {
    this.adminVideos = [];
    this.firestore
      .collection('tmp_courses')
      .valueChanges()
      .subscribe((res) => {
        res.forEach((element) => {
          this.adminVideos.push(element);
        });
      });

    console.log(this.adminVideos);
  }
  getAdminVideos() {
    return this.adminVideos;
  }
  approveVideos(value: string) {
    const data = this.adminVideos.filter((el) => el.path === value);
    this.firestore
      .collection('videos')
      .add(data[0])
      .then((data) => {
        this.onSuccess('Video has been added!');
      })
      .catch((err) => {
        this.onError(err.message);
      });

    this.firestore
      .collection('tmp_courses')
      .ref.where('path', '==', value)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return;
        }

        snapshot.forEach((doc) => {
          this.deleteVideoID = doc.id;
        });
      })
      .catch((err) => {});
  }
  filterAdminVideo(value: string) {
    const valData = this.adminVideos.filter((el) => el.path === value);
    this.adminVideos.filter((el) => el !== valData[0]);
    setTimeout(() => {}, 1000);
  }
  deleteVideo() {
    this.firestore
      .collection('tmp_courses')
      .doc(`${this.deleteVideoID}`)
      .delete();
    this.deleteVideoID = '';
  }
  getDeleteVideoAdmin(value: string) {
    this.adminVideos.filter((el) => el !== value);
    this.firestore
      .collection('tmp_courses')
      .ref.where('path', '==', value)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return;
        }

        snapshot.forEach((doc) => {
          this.deleteVideoID_temp = doc.id;
        });
      })
      .catch((err) => {});
  }
  deleteVideoAdmin() {
    console.log(this.deleteVideoID_temp);
    this.firestore
      .collection('tmp_courses')
      .doc(`${this.deleteVideoID_temp}`)
      .delete()
      .then((data) => {
        this.onSuccess('Video deleted!');
      })
      .catch((err) => {
        console.log(err);
        this.onError(err.message);
      });
  }
  videoAdminReset() {
    this.deleteVideoID_temp = '';
    this.adminVideos = [];
  }
  fetchVideos(id: number) {
    this.videos = [];
    this.firestore
      .collection('videos')
      .ref.where('id', '==', id)
      .onSnapshot((snap) => {
        snap.forEach((userRef) => {
          this.videos.push(userRef.data());
        });
      });
  }

  fetchCourses() {
    this.firestore
      .collection('courses')
      .valueChanges()
      .subscribe((res) => {
        console.log(res);
        res.forEach((element) => {
          console.log(element);
          this.courses.push(element);
        });
      });
  }
  getCourses() {
    return this.courses;
  }
  getVideos() {
    return this.videos;
  }
  getCourseById(id: number) {
    return this.courses.filter((el) => el.id === id)[0];
  }
  getVideoById(id: number) {
    return this.videos.filter((el) => el.id === id)[0];
  }
  sendData(value: string) {
    const data = {
      path: value,
      id: this.currentCourse,
      idCourse: 'CuhqiXHt5kArXOhBsZwR',
    };
    this.firestore
      .collection('tmp_courses')
      .add(data)
      .then((data) => {
        console.log(data);
        this.onSuccess('Your video has been sent!');
      })
      .catch((err) => {
        console.log(err);
        this.onError(err.message);
      });
  }
  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChanges.next(userStatus);
  }

  signUp(email: string, password: string) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((userResponse) => {
        // add the user to the "users" database
        const user = {
          id: userResponse.user.uid,
          username: userResponse.user.email,
          role: 'user',
        };

        // add the user to the database
        this.firestore
          .collection('users')
          .add(user)
          .then((user) => {
            user.get().then((x) => {
              // return the user data
              console.log(x.data());
              this.currentUser = x.data();
              this.setUserStatus(this.currentUser);
              this.router.navigate(['/']);
              this.fetchCourses();
              this.onSuccess('You are registrated!');
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log('An error ocurred: ', err);
        this.onError(err.message);
      });
  }

  login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.firestore
          .collection('users')
          .ref.where('username', '==', user.user.email)
          .onSnapshot((snap) => {
            snap.forEach((userRef) => {
              console.log('userRef', userRef.data());
              this.currentUser = userRef.data();
              // setUserStatus
              this.setUserStatus(this.currentUser);
              if (userRef.data().role !== 'admin') {
                this.router.navigate(['/']);
                this.fetchCourses();
              } else {
                this.router.navigate(['/admin']);
              }
            });
          });
      })
      .catch((err) => err);
  }

  logOut() {
    this.afAuth.auth
      .signOut()
      .then(() => {
        console.log('user signed Out successfully');
        // set current user to null to be logged out
        this.currentUser = null;
        // set the listenener to be null
        this.setUserStatus(null);
        this.resetCourses();
        this.ngZone.run(() => this.router.navigate(['/login']));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  userChanges() {
    this.afAuth.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        this.firestore
          .collection('users')
          .ref.where('username', '==', currentUser.email)
          .onSnapshot((snap) => {
            snap.forEach((userRef) => {
              this.currentUser = userRef.data();
              // setUserStatus
              this.setUserStatus(this.currentUser);
              console.log(this.userStatus);

              if (userRef.data().role !== 'admin') {
                this.ngZone.run(() => this.router.navigate(['/']));
              } else {
                this.ngZone.run(() => this.router.navigate(['/admin']));
              }
            });
          });
      } else {
        this.ngZone.run(() => this.router.navigate(['/login']));
      }
    });
  }
}
