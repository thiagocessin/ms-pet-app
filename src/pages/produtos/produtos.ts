import { API_CONFIG } from './../../config/api.config';
import { ProdutoDTO } from './../../models/produto.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoService } from '../../services/domain/produto.service';
import { LoadingController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[] = [];
  page:number = 0;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public produtoService: ProdutoService,
              public loadingControl : LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();

  }

  loadData(){
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();

    this.produtoService.findByCategoria(categoria_id, this.page, 10)
      .subscribe((res)=>{
        let start = this.items.length;
        this.items = this.items.concat(res['content']);
        let end = this.items.length-1;


        loader.dismiss();
        console.log(this.page)
        console.log(this.items)
        this.loadImageUrls(start, end);
      },
      (error)=>{
        loader.dismiss();
      });

  }

  loadImageUrls(start:number, end:number){
    for(var i=start; i < end;i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(res=>{
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
        (error)=>{})
    }

  }

  showDetail(produto_id:string){
    this.navCtrl.push('ProdutoDetailPage',{produto_id:produto_id});
  }

  presentLoading() {
    let loader = this.loadingControl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  doRefresh(event) {

    this.page=0;
    this.items=[];
    this.loadData();

    setTimeout(() => {
      event.complete();
    }, 1000);
  }

  doInfinite(event) {

    this.page++;
    this.loadData();
    setTimeout(() => {
      event.complete();
    }, 1000);
  }



}
