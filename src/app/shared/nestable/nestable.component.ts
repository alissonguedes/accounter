import { Component, Input } from '@angular/core';
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

declare const document: any;

@Component({
  selector: 'app-nestable',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './nestable.component.html',
  styleUrls: ['./nestable.component.css'],
})
export class NestableComponent {
  @Input() items: ItemNode[] = [];

  constructor() {
    this.toggle();
  }

  drop(event: CdkDragDrop<ItemNode[]>, parent?: ItemNode): void {
    const draggedItem = event.previousContainer.data[event.previousIndex];

    // Remove da lista original
    event.previousContainer.data.splice(event.previousIndex, 1);

    // Adiciona ao novo destino
    if (parent) {
      console.log('>>>', draggedItem);
      parent.children?.push(draggedItem);
    } else {
      // Soltou no nível raiz
      console.log(draggedItem);
      event.container.data.splice(event.currentIndex, 0, draggedItem);
    }
  }

  getDropListId(item: ItemNode): string {
    return 'dropList-' + item.id;
  }

  toggle() {
    let elementos = document.querySelectorAll('.drag-item');

    elementos.forEach((el: HTMLElement) => {
      el.addEventListener('click', (event) => {
        // Pega o elemento pai (.nestable-node)
        let parentNode = el.closest('.nestable-node');

        if (!parentNode) return;

        // Dentro dele, pega o .nestable-children
        let childrenContainer = parentNode.querySelector(
          '.nestable-node'
        ) as HTMLElement;

        if (!childrenContainer) return;

        // Toggle de exibição
        childrenContainer.style.display =
          childrenContainer.style.display === 'none' ? 'block' : 'none';
        // childrenContainer.classList.toggle('expanded');
      });
    });
  }
}
