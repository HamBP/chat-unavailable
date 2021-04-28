import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleSpreadsheet } from 'google-spreadsheet';

@Injectable()
export class GoogleSheetService {
  private readonly doc: GoogleSpreadsheet;

  private readonly CLIENT_EMAIL: string;
  private readonly PRIVATE_KEY: string;
  private readonly SHEET_ID: string;
  private readonly SPREADSHEET_ID: string;
  constructor(private readonly configService: ConfigService) {
    const initSheet = async () => {
      await this.doc.useServiceAccountAuth({
        client_email: this.configService.get('CLIENT_EMAIL'),
        private_key: this.configService.get('PRIVATE_KEY'),
      });
      await this.doc.loadInfo();
      await this.doc.updateProperties({ title: `K_BOT__${Date.now()}` });
    };

    this.CLIENT_EMAIL = this.configService.get('CLIENT_EMAIL');
    this.PRIVATE_KEY = this.configService.get('PRIVATE_KEY');
    this.SHEET_ID = this.configService.get('SHEET_ID');
    this.SPREADSHEET_ID = this.configService.get('SPREADSHEET_ID');
    initSheet();
  }

  async loadSheet() {
    await this.doc.useServiceAccountAuth({
      client_email: this.configService.get('CLIENT_EMAIL'),
      private_key: this.configService.get('PRIVATE_KEY'),
    });
    // loads document properties and worksheets
    await this.doc.loadInfo();
    // readAt
    await this.doc.updateProperties({ title: `K_BOT__${Date.now()}` });
  }

  // ✅ 스프레드 env 변경
  //   async __changeAPIAuth({
  //     CLIENT_EMAIL,
  //     PRIVATE_KEY,
  //     SHEET_ID,
  //     SPREADSHEET_ID,
  //   }: {
  //     CLIENT_EMAIL: string;
  //     PRIVATE_KEY: string;
  //     SHEET_ID: string;
  //     SPREADSHEET_ID: string;
  //   }) {
  //     try {
  //       this.doc = new GoogleSpreadsheet(this.SPREADSHEET_ID);

  //       this.CLIENT_EMAIL = CLIENT_EMAIL;
  //       this.PRIVATE_KEY = PRIVATE_KEY;
  //       this.SHEET_ID = SHEET_ID;
  //       this.SPREADSHEET_ID = SPREADSHEET_ID;
  //       return true;
  //     } catch (error) {
  //       return false;
  //     }
  //   }

  // ✅ 모든 시트의 제목 가져오기
  async getSheetsTitle() {
    try {
      const titles = [];
      await this.loadSheet();
      const sheetCnt = this.doc.sheetCount;
      for (let i = 0; i < sheetCnt; i++) {
        const sheet = this.doc.sheetsByIndex[i];
        titles.push(sheet['_rawProperties'].title);
      }
      return titles;
    } catch (error) {
      return [];
    }
  }
  // ✅ 모든 시트의 아이디 가져오기
  async getSheetsId() {
    try {
      const titles = [];
      await this.loadSheet();
      const sheetCnt = this.doc.sheetCount;
      for (let i = 0; i < sheetCnt; i++) {
        const sheet = this.doc.sheetsByIndex[i];
        titles.push(sheet['_rawProperties'].sheetId);
      }
      return titles;
    } catch (error) {
      return [];
    }
  }

  // ✅ 새로운 시트 생성
  // @Params(string, string[])
  async createSheet(title, headerValues) {
    try {
      await this.loadSheet();
      await this.doc.addSheet({ title, headerValues });
    } catch (error) {
      return false;
    }
    return true;
  }

  // ✅ 해당 시트 존재 여부
  async checkSheetByName(title) {
    try {
      await this.loadSheet();
      const sheet = await this.doc.sheetsByTitle[title];
      if (sheet) return true;
      return false;
    } catch (error) {
      return false;
    }
  }

  // --------------------------
  // 시트 내 작업
  // --------------------------

  // header valuse
  async __readHeaderValues(title) {
    try {
      if (!title) throw Error('title needs');
      await this.loadSheet();
      const sheet = this.doc.sheetsByTitle[title];
      return sheet.headerValues;
    } catch (error) {
      console.log('cannot read __readHeaderValues', error);
      return {};
    }
  }

  // ✅ getRows
  async getRows(title) {
    try {
      await this.loadSheet();
      const sheet = this.doc.sheetsByTitle[title];
      const sheet_title = sheet.title;
      const sheet_rowCount = sheet.rowCount;
      const rawRow = [];
      const rows = await sheet.getRows();
      rows.map((row) => {
        rawRow.push(row._rawData);
      });
      return {
        rows,
        rawRow,
        sheet_title,
        sheet_rowCount,
        headerValues: sheet.headerValues,
      };
    } catch (error) {
      console.log('cannot read rows and headerValuse', error);
      return {
        rows: [],
        headerValues: {},
      };
    }
  }
  /*
    // read/write row values
    console.log(rows[0].name); // 'Larry Page'
    rows[1].email = 'sergey@abc.xyz'; // update a value
    await rows[1].save(); // save updates
    await rows[1].delete(); // delete a row
    */

  // ✅ Row 추가
  async addRow(title, payload) {
    try {
      await this.loadSheet();
      const sheet = this.doc.sheetsByTitle[title];
      await sheet.addRow(payload);
      return true;
    } catch (error) {
      return false;
    }
  }
  // ✅ Row 업데이트
  async updateRow(title, idx, payload) {
    try {
      await this.loadSheet();
      const sheet = this.doc.sheetsByTitle[title];
      const rows = await sheet.getRows();
      rows[idx] = payload;
      await rows[idx].save();
      return true;
    } catch (error) {
      return false;
    }
  }

  // ✅ Row 삭제
  async removeRow(title, idx) {
    try {
      await this.loadSheet();
      const sheet = this.doc.sheetsByTitle[title];
      const rows = await sheet.getRows();
      await rows[idx].delete();
      return true;
    } catch (error) {
      return false;
    }
  }
}
