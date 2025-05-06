import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  inject,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  CdkDropList,
  CdkDropListGroup,
  CdkDragDrop,
  CdkDrag,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ItemNode } from './item-node.model';
import { HttpService } from '../../services/http.service';

declare const M: any;
declare const document: any;

@Component({
  selector: 'app-nestable',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './nestable.component.html',
  styleUrls: ['./nestable.component.css'],
})
export class NestableComponent implements AfterViewInit, OnInit {
  @Input() items: ItemNode[] = [];
  @Input() edit: ItemNode['edit'];
  @Input() delete: ItemNode['delete'];
  @Input() modalTarget: ItemNode['modal_target'];
  @Input() form: any;
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() itemExpanded: any;

  @ViewChild('defaultTemplate', { static: true })
  defaultTemplate!: TemplateRef<any>;
  @ViewChild('collapsible', { static: false }) collapsibleRef!: ElementRef;

  expanded = false;
  expandedIndex: number | null = null;
  expandedItems = new Set<number | string>();

  private http = inject(HttpService);
  private router = inject(Router);
  private collapsibleElem: any;
  private collapsibleInstance: any;

  ngAfterViewInit(): void {
    this.collapsibleInstance = M.Collapsible.init(
      this.collapsibleRef.nativeElement
    );
    this.toggleItem(this.itemExpanded);
  }

  ngOnInit() {
    if (!this.itemTemplate) {
      this.itemTemplate = this.defaultTemplate;
    }
  }

  preventHeaderClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  isExpanded(index: number): boolean {
    return this.expandedIndex == index;
  }

  toggleItem(index?: number): void {
    if (index == null) return;
    // alert(index + ' _ ' + this.expandedIndex);
    if (this.expandedIndex === index) {
      this.collapsibleInstance.close(index);
      this.expandedIndex = null;
    } else {
      this.collapsibleInstance.open(index);
      this.expandedIndex = index;
    }
  }

  //   toggleItem(id: number | string): void {
  //     if (this.expandedItems.has(id)) {
  //       alert(id);
  //       this.expandedItems.delete(id);
  //       this.collapsibleInstance.open(id);
  //     } else {
  //       this.expandedItems.add(id);
  //       this.collapsibleInstance.close(id);
  //     }
  //   }

  //   isExpanded(id: number | string): boolean {
  //     return this.expandedItems.has(id);
  //   }

  drop(event: CdkDragDrop<ItemNode[]>, parent?: ItemNode): void {
    const draggedItem = event.previousContainer.data[event.previousIndex];

    event.previousContainer.data.splice(event.previousIndex, 1);

    if (parent) {
      parent.children?.push(draggedItem);
    } else {
      event.container.data.splice(event.currentIndex, 0, draggedItem);
    }
  }

  getDropListId(item: ItemNode): string {
    return 'dropList-' + item.id;
  }
}
