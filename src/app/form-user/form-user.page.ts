import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatabaseService } from '../shared/services/database.service';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { Person } from '../shared/interfaces/person.interface';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.page.html',
  styleUrls: ['./form-user.page.scss'],
})
export class FormUserPage implements OnInit, AfterViewInit, ViewWillEnter {
  name = new FormControl();
  hasData;
  filterAmounts;
  finalBalance;
  final;
  person = [{}];
  currentId: string;
  data;
  constructor(
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private dataBaseService: DatabaseService
  ) {
    this.activatedRoute.params.subscribe((res) => {
      this.currentId = res.id;
    });

    this.getAllData();
  }
  async ionViewWillEnter() {
    await this.getAllData();
  }
  async ngAfterViewInit() {
    await this.dataBaseService.init();
    await this.dataBaseService.openStore(
      'llevacuentasDb',
      'Person',
      false,
      'no-encryption'
    );
    await this.dataBaseService.openStore(
      'llevacuentasDb',
      'Amount',
      false,
      'no-encryption'
    );

    await this.getAllData();

    await this.getPersonById(`${this.currentId}`);
  }

  ngOnInit() {
    this.getAllData();
  }

  gotToForm(id: string) {
    this.router.navigate([`amount-form/${id}`]);
  }
  async getAllData() {
    await this.dataBaseService.init();
    await this.dataBaseService.openStore(
      'llevacuentasDb',
      'Amount',
      false,
      'no-encryption'
    );
    await this.dataBaseService.setTable('Amount');
    const todos = await this.dataBaseService.getAllValues();

    this.final = todos.map((x) => JSON.parse(x));
    if (this.final.length === 0) {
      this.hasData = true;
    }

    this.filterAmounts = this.final.filter(
      (el) => el.personId === this.currentId
    );
    this.filterAmounts.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      } else {
        return 1;
      }
    });
    // console.log(this.filterAmounts, 'filtrado');
    let savings = 0;
    let expenses = 0;
    this.filterAmounts.forEach((element) => {
      // console.log(element.type, 'element');
      if (element.type === '1') {
        savings += element.amount;
      } else if (element.type === '2') {
        expenses += element.amount;
      } else {
        this.finalBalance = 0;
      }
    });

    this.finalBalance = savings - expenses;
  }
  async getPersonById(id: string) {
    await this.dataBaseService.setTable('Person');
    const currentPerson = JSON.parse(
      await this.dataBaseService.getItem(`${id}`)
    );
    this.person = currentPerson;
  }

  deleteAmount(id: string) {
    this.presentAlertConfirm(id);
  }

  async presentAlertConfirm(id: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          handler: async () => {
            await this.dataBaseService.removeItem(id);
            await this.getAllData();
          },
        },
      ],
    });

    await alert.present();
  }

  gotToFormForEdit(amountId: string) {
    this.router.navigate([`amount-form/${amountId}`]);
  }
}
