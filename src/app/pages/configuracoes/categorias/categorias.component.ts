import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CategoriaService } from './categoria.service';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../app.component';
import { PreloaderService } from '../../../services/preloader/preloader.service';
import { CategoriaForm } from './categoria-form';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

declare const M: any;
declare const document: any;

interface ItemNode {
  name: string;
  children?: ItemNode[];
}

@Component({
	selector: 'app-categorias',
	imports: [CommonModule, ReactiveFormsModule, DragDropModule],
	templateUrl: './categorias.component.html',
	styleUrl: './categorias.component.css',
})
export class CategoriasComponent implements OnInit {
// tree: ItemNode[] = [
//     {
//       name: 'Item 1',
//       children: [
//         { name: 'Item 1.1' },
//         { name: 'Item 1.2' }
//       ]
//     },
//     {
//       name: 'Item 2',
//       children: [
//         { name: 'Item 2.1' }
//       ]
//     }
//   ];
 treeData = [
    {
      name: 'Item 1',
      children: [
        {
          name: 'Item 1.1',
          children: [
            { name: 'Item 1.1.1', children: [] }
          ]
        },
        { name: 'Item 1.2', children: [] }
      ]
    },
    {
      name: 'Item 2',
      children: []
    }
  ];
	public categorias: any = [];
	protected searchControl = new FormControl();

	constructor(
		protected app: AppComponent,
		protected categoriaForm: CategoriaForm,
		private categoriaService: CategoriaService,
		protected preloaderService: PreloaderService
	) {

		this.categoriaForm.init();

	}

// drop(event: CdkDragDrop<ItemNode[]>, parent?: ItemNode) {
//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       transferArrayItem(event.previousContainer.data,
//                         event.container.data,
//                         event.previousIndex,
//                         event.currentIndex);
//     }
//   }

 @Input() nodes: any[] = [];

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

	ngOnInit(): void {
		this.categoriaService.getCategorias().subscribe(
			result => {
				this.categorias = result;
			}
		);

		this.search();

	}

	openModal(id?: number) {
		let modalCategoria = document.querySelector('#modal-categoria');
		let modalOptions = {
			dismissible: false,
			onOpenStart: () => {
				if (id) {
					this.categoriaForm.edit(id);
				}
			},
			onOpenEnd: () => {
				if (!id) {
					this.categoriaForm.enable();
				}
			},
			onCloseEnd: () => {
				this.categoriaForm.reset();
			}
		}
		let modal = M.Modal.init(modalCategoria, modalOptions);
		modal.open();
	}

	save() {

	}

	private search() {
		this.searchControl.valueChanges.pipe(
			debounceTime(300),
			distinctUntilChanged(),
		).subscribe(valor => {
			this.preloaderService.show();
			this.pesquisar(valor);
		})
	}

	private pesquisar(valor: string) {
		return this.categoriaService.getCategorias(valor).subscribe(
			results => {
				this.categorias = results;
				this.preloaderService.hide();
			}
		);
	}

}
