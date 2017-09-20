import { NgxPstSysPage } from './app.po';

describe('ngx-pst-sys App', () => {
  let page: NgxPstSysPage;

  beforeEach(() => {
    page = new NgxPstSysPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
