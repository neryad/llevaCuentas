import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-form-account',
  templateUrl: './form-account.page.html',
  styleUrls: ['./form-account.page.scss'],
})
export class FormAccountPage implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((res) => {
      // console.log(res);
    });
  }

  ngOnInit() {}
}
