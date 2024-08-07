import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  saveLocalStorage(value: any) {
    localStorage.setItem('loginToken', JSON.stringify(value));
  }

  getUser() {
    const loginToken = localStorage.getItem('loginToken');
    if (loginToken) {
      const parsedToken = JSON.parse(loginToken);
      return parsedToken.user || {};
    }
    return {};
  }

  saveOrganism(organism: any) {
    localStorage.setItem('organism', JSON.stringify(organism));
  }

  getOrganism() {
    return JSON.parse(localStorage.getItem('organism') || '{}');
  }
}
