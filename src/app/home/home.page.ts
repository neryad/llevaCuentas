import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  CapacitorDataStorageSqlite,
  capDataStorageOptions,
  capDataStorageResult,
  capOpenStorageOptions,
} from 'capacitor-data-storage-sqlite';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../shared/services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  platform: string;
  isService = false;
  store: any = null;
  _cardStorage: HTMLIonCardElement;
  _showAlert: any;
  final;
  constructor(private dataBaseService: DatabaseService) {}
  async ngAfterViewInit() {
    await this.dataBaseService.init();
    await this.dataBaseService.openStore(
      'test',
      'another',
      false,
      'no-encryption'
    );
    this.getAllData();
    // const date = Date.now() + Math.random();
    /** Se agrega persona */
    // await this.dataBaseService.setTable('Person');
    // await this.dataBaseService.setItem(`${uuidv4()}`, 'maria');
    // const papu = JSON.parse(
    //   await this.dataBaseService.getItem(`7622f96c-fcd5-4c43-a691-8917ee394b3a`)
    // );
    // console.log(papu);
    // const papu = JSON.parse(
    //   await this.dataBaseService.getItem(
    //     '"0ab3fce8-730a-4707-bb9c-c5f4f368dc1a"'
    //   )
    // );
    // console.log(papu, 'pau');

    // const cuenta = {
    //   id: `${uuidv4()}`,
    //   idPerson: `00a00483-900d-413a-8f87-30dae0448602`,
    //   amount: 1200,
    //   date: Date.now(),
    //   type: 'incoming3245',
    // };

    //await this.dataBaseService.setTable('Account');
    //await this.dataBaseService.setItem(`${uuidv4()}`, JSON.stringify(cuenta));
    // const todos = await this.dataBaseService.getAllValues();

    // this.final = todos.map((x) => JSON.parse(x));
    // this.final = todos;
    // console.log(this.final);

    //await this.dataBaseService.getItem('1639007627107.7415');
    // await this.dataBaseService.setItem(`${date}`, JSON.stringify(objTest2));
    // await this.dataBaseService.isStoreExists('test');
    //await this.testFirstStore();
  }
  ngOnInit(): void {
    // this.getAllData();
    // this.dataBaseService.addDummyProduct();
    // const wawa = this.dataBaseService.addDummyProduct2();
    // console.log(wawa, 'waw');
  }
  async getAllData() {
    await this.dataBaseService.setTable('Person');
    const todos = await this.dataBaseService.getAllValues();
    this.final = todos.map((x) => JSON.parse(x));
    console.log(this.final);
  }

  async test(id: string) {
    console.log(id);

    // const openStorageOptions: capOpenStorageOptions = {
    //   database: 'test',
    //   table: 'another',
    // };
    //console.log(openStorageOptions, 'hola bebe');
    // const openResult: capDataStorageResult =
    // const openResult: capDataStorageResult =
    //   await CapacitorDataStorageSqlite.openStore(openStorageOptions);
    // console.log(openResult, 'hola bebe2');
    // if (openResult.result) {
    //   const dataStorageOptions: capDataStorageOptions = {
    //     key: 'nombre',
    //     value: 'Branko',
    //   };

    //   const { result } = CapacitorDataStorageSqlite.set(dataStorageOptions);
    //   console.log(result); // true
    // }
    // console.log(id, 'id');
    await this.dataBaseService.setTable('Person');
    //const papu = await this.dataBaseService.getItem(`${id}`);

    // const final = JSON.parse(papu);

    const person = JSON.parse(await this.dataBaseService.getItem(`${id}`));
    //this.dataBaseService.closeStore('test');
    console.log(person.id);

    const cuenta = {
      id: `${uuidv4()}`,
      idPerson: `${person.id}`,
      amount: 1200,
      date: Date.now(),
      type: 'incoming3245',
    };

    await this.dataBaseService.setTable('Account');
    await this.dataBaseService.setItem(`${uuidv4()}`, `${cuenta}`);
  }
  async test2() {}
  async new() {
    const name = this.getRandomString(6);
    const idKey = uuidv4();
    console.log(idKey, 'idKey');
    const person = {
      id: `${idKey}`,
      name: `${name}`,
    };
    await this.dataBaseService.setTable('Person');
    const newPerson = await this.dataBaseService.setItem(
      `${idKey}`,
      `${JSON.stringify(person)}`
    );
    console.log(idKey, 'tes2');

    console.log(newPerson);
  }

  getRandomString(length) {
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }
}
