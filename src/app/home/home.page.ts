import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  CapacitorDataStorageSqlite,
  capDataStorageOptions,
  capDataStorageResult,
  capOpenStorageOptions,
} from 'capacitor-data-storage-sqlite';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../shared/services/database.service';
import { AlertController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe, CurrencyPipe } from '@angular/common';
// pdfMake.vfs = pdfFonts.pdMake.vfs;
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  name = new FormControl();
  platform: string;
  isService = false;
  store: any = null;
  _cardStorage: HTMLIonCardElement;
  _showAlert: any;
  finalBalance = 0;
  filterAmounts = [];
  final;
  filterfinal;
  pdfObj;
  hasData = false;
  person;
  private initialization;

  constructor(
    private dataBaseService: DatabaseService,
    private alertController: AlertController,
    private router: Router,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {}

  async ngAfterViewInit() {
    await this.dataBaseService.init();
    await this.dataBaseService.openStore(
      'llevacuentasDb',
      'Person',
      false,
      'no-encryption'
    );
    await this.getAllData();
  }
  ngOnInit(): void {}

  async saveUser() {
    const idKey = uuidv4();
    if (this.name.value === ' ' || this.name.value == null) {
      this.presentAlertNoEmptyUser();
      return;
    }

    const person = {
      id: `${idKey}`,
      name: `${this.name.value.toLowerCase()}`,
      color: this.getRandomColor(),
    };
    await this.dataBaseService.setTable('Person');
    let newPerson;
    try {
      newPerson = await this.dataBaseService.setItem(
        `${idKey}`,
        `${JSON.stringify(person)}`
      );
    } catch (error) {
      console.log(error, 'error');
    }

    // console.log(newPerson);
    // this.route.navigate(['/home']);
    await this.getAllData();
    this.name.reset();
  }
  async deleteUser(id: string) {
    this.presentAlertConfirm(id);
  }
  gotToAccount(id: string) {
    this.router.navigate([`form-user/${id}`]);
  }
  async getAllData() {
    this.hasData = false;
    await this.dataBaseService.setTable('Person');
    const todos = await this.dataBaseService.getAllValues();

    this.final = todos
      .map((x) => JSON.parse(x))
      .sort((a, b) => a.name - b.name);

    if (this.final.length === 0) {
      this.hasData = true;
    }
    const test = this.final.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  async presentAlertNoEmptyUser() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Aviso!',
      message: 'Debe poner un nombre!',
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
          handler: async (blah) => {
            // console.log('Confirm ok: blah');
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertConfirm(id: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Seguro de borrar el usuario?',
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
  getRandomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  async downloadPdf(id: string) {
    await this.dataBaseService.setTable('Person');
    const currentPerson = JSON.parse(
      await this.dataBaseService.getItem(`${id}`)
    );

    this.person = currentPerson;
    await this.getAllDataFromUser(id);

    const docDefinition = {
      header: { text: `Lleva cuentas: ${this.person.name}`, style: 'header' },

      styles: { header: { fontSize: 18, alignment: 'center', margin: [5, 5] } },
      watermark: {
        text: 'llevaCuentas',
        color: 'blue',
        opacity: 0.1,
        bold: true,
      },

      content: [
        {
          layout: 'lightHorizontalLines', // optional

          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', 'auto', 100, '*'],

            body: [
              ['Date', 'Description', 'Amount', 'Type'],
              ...this.filterAmounts.map(
                ({ date, description, amount, type }) => [
                  this.datePipe.transform(new Date(date), 'mediumDate'),
                  description,
                  this.currencyPipe.transform(amount),
                  type === '1' ? 'Saving' : 'Expense',
                ]
              ),
              [
                { text: 'Balance', bold: true },
                { text: '' },
                {
                  text: `${this.currencyPipe.transform(this.finalBalance)}`,
                  bold: true,
                },
                { text: '' },
              ],
            ],
          },
        },
      ],
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);

    this.pdfObj.download(`${this.person.name}-account`);
  }

  async getAllDataFromUser(currentId: string) {
    await this.dataBaseService.init();
    await this.dataBaseService.openStore(
      'llevacuentasDb',
      'Amount',
      false,
      'no-encryption'
    );
    await this.dataBaseService.setTable('Amount');
    const todos = await this.dataBaseService.getAllValues();

    this.filterfinal = todos.map((x) => JSON.parse(x));
    if (this.filterfinal.length === 0) {
      this.hasData = true;
    }

    this.filterAmounts = this.filterfinal.filter(
      (el) => el.personId === currentId
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
}
