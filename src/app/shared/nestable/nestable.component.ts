import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  inject,
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
export class NestableComponent implements AfterViewInit {
  @Input() items: ItemNode[] = [];
  @Input() edit: ItemNode['edit'];
  @Input() delete: ItemNode['delete'];
  @Input() modalTarget: ItemNode['modal_target'];
  @Input() form: any;

  @ViewChild('collapsible', { static: false }) collapsibleRef!: ElementRef;

  expanded = false;
  expandedIndex: number | null = null;

  private http = inject(HttpService);
  private router = inject(Router);
  private collapsibleElem: any;
  private collapsibleInstance: any;

  ngAfterViewInit(): void {
    this.collapsibleInstance = M.Collapsible.init(
      this.collapsibleRef.nativeElement
    );
  }

  preventHeaderClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  isExpanded(index: number): boolean {
    return this.expandedIndex === index;
  }

  toggleItem(index: number): void {
    if (this.expandedIndex === index) {
      this.collapsibleInstance.close(index);
      this.expandedIndex = null;
    } else {
      this.collapsibleInstance.open(index);
      this.expandedIndex = index;
    }
  }

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

  openModal(target: string, form: any, id?: number) {
    let modalElement = document.querySelector(target);
    let modalOptions = {
      dismissible: false,
      onOpenStart: () => {
        if (id) {
          form.edit(id);
        } else {
          form.enable();
        }
      },
      onOpenEnd: () => {
        if (!id) {
        }
      },
      onCloseEnd: () => {
        form.reset();
      },
    };
    let modal = M.Modal.init(modalElement, modalOptions);
    modal.open();
  }

  deleteItem(id: number) {
    let confirma = confirm(
      'Tem certeza de que deseja remover este registro? Tenha em mente que se continuar, todas as categorias dependentes desta categoria serão removidas, bem como todas as respectivas subcategorias.'
    );
    if (confirma) {
      let deleteUrl = `${this.delete}/${id}`;
      this.http.delete(deleteUrl).subscribe((ok: any) => {
        if (ok.success) {
          alert(ok.message);
          //   this.router.navigate(this.delete);
          location.reload();
        }
        console.log(ok);
      });
    }
  }
}
