import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJogo } from '../jogo.model';

@Component({
  selector: 'jhi-jogo-detail',
  templateUrl: './jogo-detail.component.html',
})
export class JogoDetailComponent implements OnInit {
  jogo: IJogo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jogo }) => {
      this.jogo = jogo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
