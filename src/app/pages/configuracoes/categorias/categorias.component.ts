import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
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
  public allCategorias: any;
  public categorias: ItemNode[] = [];
  public checkedStatus = true;
  public canEdit = true;
  public canDelete = true;

  protected searchControl = new FormControl();
  itemExpanded: number | null = null;
  isExpanded: boolean = false;

  constructor(
    protected app: AppComponent,
    protected categoriaForm: CategoriaForm,
    protected categoriaService: CategoriaService,
    protected preloaderService: PreloaderService
  ) {
    this.categoriaForm.init();
  }

  ngOnInit(): void {
    this.search();
    this.getCategorias();
  }

  private getCategorias() {
    let self = this;
    let c = this.categoriaService;
    let categorias;
    // let preloaderService = this.preloaderService;
    this.preloaderService.show();
    setTimeout(function () {
      c.getCategorias().subscribe((result) => {
        self.categorias = self.parseCategorias(result);
        self.allCategorias = result;
        self.preloaderService.hide();
      });
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
    let modalCategoria = document.querySelector('#modal-categoria');
    let modalOptions = {
      dismissible: false,
      onOpenStart: () => {
        if (id) {
          this.categoriaForm.edit(id);
        } else {
          this.categoriaForm.getForm().get('status')?.setValue('1');
          this.categoriaForm.enable();
        }
        setTimeout(() => {
          //   console.log(this.categoriaForm.getForm().get('status')?.getValue());
        });
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
    const slug = slugify(titulo); // <-- ajuste aqui conforme seu objetivo real
    return this.categoriaForm.getForm().get('titulo_slug')?.setValue(slug);
  }

  save() {
    this.categoriaForm.disable();
    let values = this.categoriaForm.getValues();
    values.status = values.status ? '1' : '0';
    console.log(values);
    this.categoriaService.saveCategoria(values).subscribe(
      (ok: any) => {
        this.categoriaForm.enable();
        this.categoriaForm.alert(ok.success, ok.message);
        let mClose = document.querySelector('.modal-close');
        this.getCategorias();
        mClose.click();
        setTimeout(() => {
          let btnExpand = document.querySelector('.btn-expand');
          btnExpand.querySelector('i').innerText = 'keyboard_arrow_down';
          console.log(btnExpand.querySelector('i'));
        }, 100);
      },
      (err: any) => {
        this.categoriaForm.enable();
      }
    );
  }

  private search() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((valor) => {
        if (valor) {
          this.preloaderService.show();
          this.pesquisar(valor);
        } else {
          this.getCategorias();
        }
      });
  }

  private pesquisar(valor: string) {
        return this.categoriaService.getCategorias(valor).subscribe((results) => {
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
      console.log(c);
      this.categorias = c;
    });
  }

  updateStatus(item: any) {
    const originalStatus = item.status;
    item.status = originalStatus === '1' ? '0' : '1';
    return this.categoriaService
      .atualizaStatus(item.id, { status: item.status })
      .subscribe(
        (ok: any) => {
          if (ok.success) {
            this.categoriaService.getCategorias().subscribe((result) => {
              this.categorias = this.parseCategorias(result);
            });
          }
        },
        (error) => {
          item.status = originalStatus;
          this.categoriaForm.alert(500, 'Erro ao atualizar categoria');
        }
      );
  }

  delete(id: number) {
    let confirma = confirm(
      'Tem certeza de que deseja remover este registro? Tenha em mente que se continuar, todas as categorias dependentes desta categoria serão removidas, bem como todas as respectivas subcategorias.'
    );
    if (confirma) {
      this.categoriaService.removeCategoria(id).subscribe((ok: any) => {
        if (ok.success) {
          this.categoriaForm.enable();
          this.categoriaForm.alert(ok.success, ok.message);
          this.getCategorias();
          let mClose = document.querySelector('.modal-close');
          mClose.click();
        }
        console.log(ok);
      });
    }
  }
}
