import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CategoriaService } from './categoria.service';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../app.component';
import { PreloaderService } from '../../../services/preloader/preloader.service';
import { CategoriaForm } from './categoria-form';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NestableComponent } from '../../../shared/nestable/nestable.component';
import { ItemNode } from '../../../shared/nestable/item-node.model';

declare const M: any;
declare const document: any;

@Component({
  selector: 'app-categorias',
  imports: [CommonModule, ReactiveFormsModule, NestableComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
})
export class CategoriasComponent implements OnInit {
  public categorias: ItemNode[] = [];

  protected searchControl = new FormControl();

  constructor(
    protected app: AppComponent,
    protected categoriaForm: CategoriaForm,
    private categoriaService: CategoriaService,
    protected preloaderService: PreloaderService
  ) {
    this.categoriaForm.init();
  }

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe((result) => {
      this.categorias = this.parseCategorias(result);
    });

    this.search();
  }

  private parseCategorias(
    categorias: any,
    parentId: number | null = null
  ): ItemNode[] {
    let categoriasBuild = [];

    for (let categoria of categorias) {
      categoriasBuild.push({
        id: categoria.id,
        name: categoria.titulo,
        id_parent: categoria.id_parent,
        icon: categoria.icone,
        color: categoria.cor,
      });
    }

    return categoriasBuild
      .filter((c) => c.id_parent === parentId)
      .map((c) => ({
        ...c,
        children: this.parseCategorias(categorias, c.id),
      }));
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
      },
    };
    let modal = M.Modal.init(modalCategoria, modalOptions);
    modal.open();
  }

  save() {}

  private search() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((valor) => {
        this.preloaderService.show();
        this.pesquisar(valor);
      });
  }

  private pesquisar(valor: string) {
    return this.categoriaService.getCategorias(valor).subscribe((results) => {
      // this.categorias = results;
      this.parseCategorias(results);
      this.preloaderService.hide();
    });
  }

  delete(id: number) {
    console.log(`Registro ${id} excluído com sucesso!`);
  }
}
