import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { B1migration } from '../services/b1migration';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class MaintenancePage {
  migrating = false;
  migrateResult: string | null = null;
  migrateError: string | null = null;

  constructor(private shortDescMigration: B1migration) {}

  async onMigrateShortDescriptions() {
    this.migrating = true;
    this.migrateResult = null;
    this.migrateError = null;

    try {
      const count = await this.shortDescMigration.migrateShortDescriptions();
      this.migrateResult = `Migration completed. Updated ${count} doc(s).`;
    } catch (err: any) {
      console.error(err);
      this.migrateError = 'Migration failed. See console for details.';
    } finally {
      this.migrating = false;
    }
  }
}



 

