import { Component, OnInit, Input, ViewChild, SimpleChanges, inject, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ColumnConfig, ColumnType } from './column-config.model';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-ui-datatable',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MaterialModule
  ],
  templateUrl: './ui-datatable.component.html',
  styleUrls: ['./ui-datatable.component.css'],
})
export class UiDatatableComponent implements OnInit, AfterViewInit {
  router = inject(Router);

  @Input() data: any[] = [];
  @Input() columns: ColumnConfig[] = [];

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  pageSizeOptions = [5, 10, 20];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ColumnType = ColumnType; // Expose ColumnType enum to the template

  ngOnInit(): void {
    
    this.displayedColumns = this.columns.map(col => col.key);
    this.dataSource.data = this.data;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.dataSource.data = this.data;
      if (this.paginator) {
        this.paginator.length = this.dataSource.data.length;
      }
    }

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getColumnType(key: string): ColumnType | undefined {
    return this.columns.find(col => col.key === key)?.type;
  }
}
