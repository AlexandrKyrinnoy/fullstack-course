import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Filter} from "../../shared/interfaces";
import {MaterialService, MaterialDatePicker} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnInit, OnDestroy, AfterViewInit  {

  @Output() onFilter = new EventEmitter<Filter>()
  @ViewChild('start', null) startRef: ElementRef
  @ViewChild('end', null) endRef: ElementRef
  @ViewChild('numOrder', null) numOrderRef: ElementRef

  order: number
  start: MaterialDatePicker
  end: MaterialDatePicker

  isValid = true

  constructor() {
  }

  ngOnInit() {}

  ngOnDestroy(){
    this.start.destroy()
    this.end.destroy()
  }

  ngAfterViewInit(){
    this.start = MaterialService.initDatePicker(this.startRef, this.validate.bind(this))
    this.end = MaterialService.initDatePicker(this.endRef, this.validate.bind(this))
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = false
      return
    }
    this.isValid = this.start.date < this.end.date
  }

  submitFilter() {
    const filter: Filter = {}

    if (this.order) {
      filter.order = this.order
    }

    if (this.start.date) filter.start = this.start.date
    if (this.end.date) filter.end = this.end.date

    this.onFilter.emit(filter)
  }

  clearFilter() {
    this.startRef.nativeElement.value = null
    this.endRef.nativeElement.value = null
    this.numOrderRef.nativeElement.value = null
    this.onFilter.emit({})
    this.isValid = false
  }

  changeNumOrder() {
    if (this.numOrderRef.nativeElement.value.length !== 0) this.isValid = true
  }

}
