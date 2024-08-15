import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAsExcelComponent } from './download-as-excel.component';

describe('DownloadAsExcelComponent', () => {
  let component: DownloadAsExcelComponent;
  let fixture: ComponentFixture<DownloadAsExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadAsExcelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadAsExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
