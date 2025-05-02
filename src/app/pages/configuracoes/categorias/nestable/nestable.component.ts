import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropList,
 CdkDropListGroup,
 CdkDragDrop,
CdkDrag,
DragDropModule,
 moveItemInArray,
 transferArrayItem } from '@angular/cdk/drag-drop';
import { ItemNode } from './item-node.model';

@Component({
  selector: 'app-nestable',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './nestable.component.html',
  styleUrls: ['./nestable.component.css']
})
export class NestableComponent {

@Input() items: ItemNode[] = [];

	drop(event: CdkDragDrop<ItemNode[]>, parent?: ItemNode): void {
		const draggedItem = event.previousContainer.data[event.previousIndex];

		// Remove da lista original
		event.previousContainer.data.splice(event.previousIndex, 1);

		// Adiciona ao novo destino
		if (parent) {
			console.log('>>>', draggedItem);
			parent.children.push(draggedItem);
		} else {
			// Soltou no nível raiz
			console.log(draggedItem);
			event.container.data.splice(event.currentIndex, 0, draggedItem);
		}

	}

	getDropListId(item: ItemNode): string {
		return 'dropList-' + item.id;
	}

}
