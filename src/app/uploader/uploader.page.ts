import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http'
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {

  imageURL:string
  desc: string

  busy: boolean = false

  @ViewChild('fileButton') fileButton
  
  constructor(private router: Router,
              public http: Http,
              public afstore: AngularFirestore,
              public user: UserService,
              private alertController: AlertController,
              
              ) { }

  ngOnInit() {
  }

  async createPost() {
		
    this.busy = true

		const image = this.imageURL
    const desc = this.desc

      this.afstore.doc(`users/${this.user.getUID()}`).update({
		  	posts: firestore.FieldValue.arrayUnion(image)
      })
      
      this.afstore.doc(`posts/${image}`).set({
        desc,
        author: this.user.getUsername(),
        likes: []
      })

      this.busy = false
      this.imageURL = ""
      this.desc = ""

      const alert = await this.alertController.create({
        header: 'Done',
        message: 'Your post was created!',
        buttons: ['cool!']
      })
      await alert.present()
      this.router.navigate(['/tabs/feed'])
  }

  uploadFile() {
		this.fileButton.nativeElement.click()
}

  fileChanged(event){

    
    this.busy = true
    const files = event.target.files

    const data = new FormData()
    data.append('file', files[0])
    data.append('UPLOADCARE_STORE', '1')
    data.append('UPLOADCARE_PUB_KEY', '28073a14c4a03f78a02a')

    this.http.post('https://upload.uploadcare.com/base/',data)
    .subscribe(event => {
      console.log(event)
      this.imageURL = event.json().file
      this.busy = false
    })
  }

}

