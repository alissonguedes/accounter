import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CategoriaService } from './categoria.service';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../../app.component';
import { PreloaderService } from '../../../services/preloader/preloader.service';
import { CategoriaForm } from './categoria-form';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { NestableComponent } from '../../../shared/nestable/nestable.component';
import { ItemNode } from '../../../shared/nestable/item-node.model';
import { slugify } from '../../../app.config';

declare const M: any;
declare const document: any;

@Component({
  selector: 'app-categorias',
  imports: [CommonModule, ReactiveFormsModule, NestableComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
})
export class CategoriasComponent implements OnInit {
  @ViewChild('modalCategoria') modalCategoriaRef!: ElementRef;
  @ViewChild('modalDialog') modalDialogRef!: ElementRef;

  public allCategorias: any;
  public categorias: ItemNode[] = [];
  public checkedStatus = true;
  public canEdit = true;
  public canDelete = true;

  protected searchControl = new FormControl();
  protected itemExpanded: number | null = null;
  protected isExpanded: boolean = false;

  constructor(
    protected app: AppComponent,
    protected categoriaForm: CategoriaForm,
    protected categoriaService: CategoriaService,
    protected preloaderService: PreloaderService
  ) {
    this.categoriaForm.init();
  }

  ngOnInit(): void {
    // Resgata todas as categorias do banco de dados
    this.getCategorias();

    // Adiciona o evento de pesquisa no input[id="search"]
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((valor) => {
        this.preloaderService.show();
        this.getCategorias(valor);
      });

    this.categoriaService.getCategorias().subscribe(
      (results) => (
        (this.categorias = this.parseCategorias(results)), // Lista todas as categorias para evitar o delay de exibir "Nenhum resultado" prematuramente
        (this.allCategorias = results) // Categorias para listar no Select[name="id_parent"]
      )
    );
  }

  /**
   * Obtém todas as categorias do banco
   */
  private getCategorias(valor?: string) {
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
        this.categorias = c;
      } else {
        this.categorias = this.parseCategorias(results);
      }
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

  openModal(id?: number) {
    const modalCategoria = this.modalCategoriaRef.nativeElement;
    let modalOptions = {
      dismissible: false,
      startingTop: '100px',
      endingTop: '100px',
      onOpenStart: () => {
        if (id) {
          this.categoriaForm.edit(id);
        } else {
          this.categoriaForm.getForm().get('status')?.setValue('1');
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

  replaceTitulo() {
    const titulo = this.categoriaForm.getForm().get('titulo')?.value;
    const slug = slugify(titulo);
    return this.categoriaForm.getForm().get('titulo_slug')?.setValue(slug);
  }

  /**
   * Adiciona (sem id)/ Edita (com id) categoria
   */
  save() {
    this.categoriaForm.disable();
    let values = this.categoriaForm.getValues();
    values.status = values.status ? '1' : '0';
    this.categoriaService.saveCategoria(values).subscribe(
      (ok: any) => {
        this.categoriaForm.enable();
        this.categoriaForm.alert(ok.success, ok.message);
        this.getCategorias(this.searchControl.value);
        let modalCategoria = this.modalCategoriaRef.nativeElement;
        let modal = M.Modal.getInstance(modalCategoria);
        modal.close();
      },
      (err: any) => {
        this.categoriaForm.enable();
      }
    );
  }

  /**
   * Muda status:
   * 1 - ativo; 2 - inativo
   */
  updateStatus(item: any) {
    const originalStatus = item.status;
    item.status = originalStatus === '1' ? '0' : '1';
    return this.categoriaService
      .atualizaStatus(item.id, { status: item.status })
      .subscribe(
        (ok: any) => {
          if (ok.success) {
            this.getCategorias(this.searchControl.value);
          }
        },
        (error) => {
          item.status = originalStatus;
          this.categoriaForm.alert(500, 'Erro ao atualizar categoria');
        }
      );
  }

  dialog(id: number) {
    const modalDialog = this.modalDialogRef.nativeElement;
    let modalOptions = {
      startingTop: '30%',
      endingTop: '30%',
      onOpenEnd: () => {
        let btn_delete = modalDialog.querySelector('.btn-confirm');
        if (btn_delete) {
          btn_delete.addEventListener('click', () => this.delete(id));
        }
      },
      onCloseEnd: () => {},
    };
    let modal = M.Modal.init(modalDialog, modalOptions);
    modal.open();
  }

  delete(id: number) {
    this.categoriaService.removeCategoria(id).subscribe((ok: any) => {
      if (ok.success) {
        this.categoriaForm.enable();
        this.categoriaForm.alert(ok.success, ok.message);
        this.getCategorias(this.searchControl.value);
        let modalDialog = this.modalDialogRef.nativeElement;
        let dialog = M.Modal.getInstance(modalDialog);
        dialog.close();
      }
    });
  }
}
