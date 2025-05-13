import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, BehaviorSubject } from 'rxjs';

import { PreloaderService } from '../../../services/preloader/preloader.service';
import { PreloaderComponent } from '../../../services/preloader/preloader/preloader.component';
import { NestableComponent } from '../../../shared/nestable/nestable.component';
import { ItemNode } from '../../../shared/nestable/item-node.model';
import { slugify } from '../../../app.config';
import { toast } from '../../../shared/toast';

import { CategoriaService } from './categoria.service';
import { CategoriaForm } from './categoria-form';

declare const M: any;
declare const document: any;

@Component({
  selector: 'app-categorias',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NestableComponent,
    PreloaderComponent,
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
})
export class CategoriasComponent implements OnInit {
  @ViewChild('modalCategoria') modalCategoria!: ElementRef;
  @ViewChild('modalDialog') modalDialog!: ElementRef;

  public categorias$: BehaviorSubject<ItemNode[]> = new BehaviorSubject<
    ItemNode[]
  >([]);
  public isLoading = false;
  protected searchControl = new FormControl();

  public allCategorias: any;

  protected itemExpanded: number | null = null;
  protected isExpanded: boolean = false;

  constructor(
    protected categoriaForm: CategoriaForm,
    protected categoriaService: CategoriaService,
    protected preloaderService: PreloaderService
  ) {}

  ngOnInit(): void {
    // Resgata todas as categorias do banco de dados
    this.getCategorias();

    // Adiciona o evento de pesquisa no input[id="search"]
    this.searchControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((valor) => {
        this.preloaderService.show('progress-bar');
        this.getCategorias(valor);
      });

    this.categoriaService.getCategorias().subscribe((results) => {
      // this.categorias$.next(this.parseCategorias(results)), // Lista todas as categorias para evitar o delay de exibir "Nenhum resultado" prematuramente
      this.allCategorias = results; // Categorias para listar no Select[name="id_parent"]
      this.preloaderService.hide('progress-bar');
    });
  }

  /**
   * Obtém todas as categorias do banco
   */
  private getCategorias(valor?: string) {
    this.isLoading = true;
    this.preloaderService.show('progress-bar');
    return this.categoriaService.getCategorias(valor).subscribe((results) => {
      if (valor) {
        let c = [];
        let categorias = results;
        for (let i of categorias) {
          let cdata = {
            name: i.titulo,
            categoriaTitulo: i.tituloParent,
            id: i.id,
            status: i.status,
          };
          c.push(cdata);
        }
        this.categorias$.next(c);
      } else {
        this.categorias$.next(this.parseCategorias(results));
      }
      this.isLoading = false;
      this.preloaderService.hide('progress-bar');
    });
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
        status: categoria.status,
      });
    }

    return categoriasBuild
      .filter((c) => c.id_parent === parentId)
      .map((c) => ({
        ...c,
        children: this.parseCategorias(categorias, c.id),
      }));
  }

  /**
   * Salva a categoria sem considerar se deve cadastrar ou editar
   */
  save() {
    this.categoriaForm.disable();
    let categoria = this.categoriaForm.getValues();
    categoria.status = categoria.status ? '1' : '0';

    let categoriaNode: ItemNode = {
      id: categoria.id ?? null,
      name: categoria.titulo,
      id_parent: categoria.id_parent,
      icon: categoria.icone,
      color: categoria.cor,
      status: categoria.status,
    };

    if (!categoria.id) {
      let categ = [...this.categorias$.value, categoriaNode];
      this.categorias$.next(categ);
    } else {
      const index = this.categorias$.value.findIndex(
        (item) => item.id === categoria.id
      );
      if (index !== -1) {
        this.categorias$.value[index] = categoriaNode;
        this.categorias$.next([...this.categorias$.value]);
      }
    }

    let modalCategoria = this.modalCategoria.nativeElement;
    let modal = M.Modal.getInstance(modalCategoria);
    modal.close();

    this.categoriaService.saveCategoria(categoria).subscribe(
      (ok: any) => {
        toast(ok.message);
        this.categorias$.next(this.parseCategorias(ok.categorias));
        this.allCategorias = ok.categorias;
      },
      (err: any) => {
        this.categoriaForm.enable();
        this.getCategorias(this.searchControl.value); // Recarrega os dados do servidor caso falhe
      }
    );
  }

  /**
   * Muda status:
   * 1 - ativo; 2 - inativo
   */
  updateStatus(updatedItem: any) {
    const originalStatus = updatedItem.status;
    updatedItem.status = originalStatus === '1' ? '0' : '1';

    const index = this.categorias$.value.findIndex(
      (item) => item.id === updatedItem.id
    );

    if (index !== -1) {
      this.categorias$.value[index] = updatedItem;
      this.categorias$.next([...this.categorias$.value]);
    }

    return this.categoriaService
      .atualizaStatus(updatedItem.id, { status: updatedItem.status })
      .subscribe(
        (ok: any) => {
          if (ok.success) {
            toast(ok.message);
            // this.getCategorias(this.searchControl.value); // Recarrega os dados do servidor caso falhe
          }
        },
        (error) => {
          updatedItem.status = originalStatus;
          this.categoriaForm.alert(500, 'Erro ao atualizar categoria');
        }
      );
  }

  /**
   * Método para remover itens aninhados
   */
  private deleteRecursivo(categorias: any[], idRemove: number): any[] {
    return categorias
      .map((categoria: any) => {
        if (categoria.children) {
          categoria = {
            ...categoria,
            children: this.deleteRecursivo(categoria.children, idRemove),
          };
          return categoria;
        }
      })
      .filter((categoria) => categoria.id !== idRemove);
  }

  deleteCategoria(id: number) {
    const deletedCategoria = this.deleteRecursivo(this.categorias$.value, id);

    this.categorias$.next(deletedCategoria);

    let modalDialog = this.modalDialog.nativeElement;
    let modal = M.Modal.getInstance(modalDialog);
    modal.close();

    this.categoriaService.removeCategoria(id).subscribe(
      (ok: any) => {
        if (ok.success) {
          toast(ok.message);
        }
      },
      (err: any) => {
        alert('Erro ao excluir no servidor');
        this.getCategorias(this.searchControl.value); // Recarrega os dados do servidor caso falhe
      }
    );
  }

  openModal(id?: number) {
    const modalElement = this.modalCategoria.nativeElement;
    let modalOptions = {
      dismissible: false,
      startingTop: '100px',
      endingTop: '100px',
      onOpenStart: () => {
        this.categoriaForm.submitForm(id);
      },
      onCloseEnd: () => {
        this.categoriaForm.reset();
      },
    };
    let modal = M.Modal.init(modalElement, modalOptions);
    modal.open();
  }

  replaceTitulo() {
    const titulo = this.categoriaForm.getForm().get('titulo')?.value;
    const slug = slugify(titulo);
    return this.categoriaForm.getForm().get('titulo_slug')?.setValue(slug);
  }

  dialog(id: number): void {
    const modalElement = this.modalDialog?.nativeElement;

    if (!modalElement) return;

    // Verifica se já há uma instância do modal
    let existingInstance = M.Modal.getInstance(modalElement);
    if (existingInstance) {
      existingInstance.destroy();
    }

    // Remove qualquer listener anterior para evitar múltiplas execuções
    const btnDelete = modalElement.querySelector('.btn-confirm');
    if (btnDelete) {
      const clonedBtn = btnDelete.cloneNode(true);
      btnDelete.parentNode.replaceChild(clonedBtn, btnDelete);

      clonedBtn.addEventListener('click', () => {
        this.deleteCategoria(id);
      });
    }

    const modalOptions = {
      startingTop: '30%',
      endingTop: '30%',
    };

    const modalInstance = M.Modal.init(modalElement, modalOptions);
    modalInstance.open();
  }
}
